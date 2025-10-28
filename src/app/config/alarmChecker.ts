import moment from "moment-timezone";
import cron from "node-cron";
import { sendNotification } from "../config/firebase";
import { Event_Model } from "../modules/event/event.schema";
import { NotificationService } from "../modules/notification/notification.service";

cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron running at", moment.utc().format());

  const nowUTC = moment.utc();
  const oneMinuteLaterUTC = moment.utc().add(1, "minute");

  // Use UTC comparison for alarms
  const events = await Event_Model.find({
    alarm: { $gte: nowUTC.toDate(), $lt: oneMinuteLaterUTC.toDate() },
    status: "upcoming",
    isDeleted: false,
  }).populate("userId", "fcmToken");

  console.log(`Found ${events.length} event(s) to trigger.`);

  for (const event of events) {
    const user: any = event.userId;
    console.log("user :", user);
    if (!user?.fcmToken) continue;

    try {
      // Convert UTC time back to user's timezone for notification message
      const localTime = moment.utc(event.time).tz(event.timezone).format("h:mm A");
      console.log("localTime: ", localTime);
      await sendNotification(
        user.fcmToken,
        "⏰ Event Reminder",
        `${event.title} is scheduled for ${localTime}`,
        {
          voice_url: event.voice_url || "", //  Pass voice URL for Flutter
          eventId: String(event._id), // (optional) also useful for frontend reference
        }
      );

      // Update event status
      event.status = "complete";
      await event.save();

      // Store notification history
      await NotificationService.createNotification({
        userId: user._id,
        eventId: event._id,
        title: "⏰ Event Reminder",
        message: `${event.title} is scheduled for ${localTime}`,
        voice_url: event.voice_url,
      });

      console.log(`✅ Notification sent for event "${event.title}"`);
    } catch (err) {
      console.error(`❌ Error sending notification for event "${event.title}":`, err);
    }
  }

  console.log("✅ Checked alarms at", moment.utc().format());
});
