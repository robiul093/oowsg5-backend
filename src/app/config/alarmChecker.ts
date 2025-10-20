import moment from "moment-timezone";
import cron from "node-cron";
import { sendNotification } from "../config/firebase";
import { Event_Model } from "../modules/event/event.schema";

cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron running at", moment.utc().format());

  const nowUTC = moment.utc();
  const oneMinuteLaterUTC = moment.utc().add(1, "minute");

  // Use UTC comparison for alarms
  const events = await Event_Model.find({
    alarm: { $gte: nowUTC.toDate(), $lt: oneMinuteLaterUTC.toDate() },
    status: "upcoming",
    isDeleted: false,
  }).populate("userId");

  console.log(`Found ${events.length} event(s) to trigger.`);

  for (const event of events) {
    const user: any = event.userId;
    if (!user?.fcmToken) continue;

    try {
      // Convert UTC time back to user's timezone for notification message
      const localTime = moment.utc(event.time).tz(event.timezone).format("h:mm A");

      await sendNotification(
        user.fcmToken,
        "⏰ Event Reminder",
        `${event.title} is scheduled for ${localTime}`
      );

      // Update event status
      event.status = "complete";
      await event.save();

      console.log(`✅ Notification sent for event "${event.title}"`);
    } catch (err) {
      console.error(`❌ Error sending notification for event "${event.title}":`, err);
    }
  }

  console.log("✅ Checked alarms at", moment.utc().format());
});
