import cron from "node-cron";
import { sendNotification } from "../config/firebase";
import { Event_Model } from "../modules/event/event.schema";

// Runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();

  // Find events whose alarm time is within this minute and not deleted
  const events = await Event_Model.find({
    alarm: { $lte: now },
    status: "upcoming",
    isDeleted: false,
  }).populate("userId");

  for (const event of events) {
    const user: any = event.userId;
    if (!user?.fcmToken) continue;

    // Send push notification
    await sendNotification(
      user.fcmToken,
      "⏰ Event Reminder",
      `${event.title} is scheduled for ${new Date(event.time).toLocaleTimeString()}`
    );

    // Update event status
    event.status = "complete";
    await event.save();
  }

  console.log(`Checked alarms at ${now.toISOString()}`);
});
