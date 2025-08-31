import express from "express";
import circuitRoutes from "./routes/circuitRoutes"
import userRoutes from "./routes/userRoutes"
import weatherRoutes from "./routes/weatherRoutes"
import { errorHandler } from "./middlewares/errorHandler";
import cors from 'cors'
import { startWeatherCron } from "./cron/weatherJobs";

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
}))

app.get("/", (req, res) => {
    res.send("Hello from app.ts")
})

app.use("/api/circuit", circuitRoutes);
app.use("/api/user", userRoutes);
app.use("/api/weather", weatherRoutes)
startWeatherCron();

app.use(errorHandler)

export default app