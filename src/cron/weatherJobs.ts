import nodeCron from "node-cron";
import { updateWeatherService } from "../services/weatherService";

function startWeatherCron() {
  nodeCron.schedule(
    "0 9 * * *",
    async () => {
        console.log("Running daily auto weather update...");
        try{
            await updateWeatherService();
            console.log("Auto weather update completed.")
        } catch(err) {
            console.error("Auto weather update failed:", err)
        }
    },
    {
      timezone: "Asia/Bangkok",
    }
  );
}

async function manualWeatherUpdate() {
  console.log("Running manual weather update...");
  try{
      await updateWeatherService();
    console.log("Manual weather update completed.")
  } catch(err) {
    console.error("Manual weather update filed:", err)
  }
}

export { startWeatherCron, manualWeatherUpdate };
