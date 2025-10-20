import mongoose from "mongoose";
import { app } from "./app";
import config from "./app/config";

async function main() {
  try {
    await mongoose.connect(config.database_url!);
    console.log("✅ Database connected successfully");

    // Start the server
    app.listen(config.port, () => {
      console.log(`🚀 Server listening on port ${config.port}`);
    });

    // Initialize cron job after DB connection
    await import("./app/config/alarmChecker");
    console.log("⏰ Alarm checker initialized");
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
}

main();
