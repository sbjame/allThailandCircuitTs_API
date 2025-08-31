import nodeCron from "node-cron";
import { updateWeatherService } from "../services/weatherService";

async function startWeatherCron() {
  nodeCron.schedule(
    "0 9 * * *",
    async () => {
      console.log("Running daily auto weather update...");
      await updateWeatherService();
    },
    {
      timezone: "Asia/Bangkok",
    }
  );
}

async function manualWeatherUpdate() {
  console.log("Running manual weather update...");
  await updateWeatherService();
}

export { startWeatherCron, manualWeatherUpdate };
