import express from "express";
import circuitRoutes from "./routes/circuitRoutes";
import userRoutes from "./routes/userRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import { startWeatherCron } from "./cron/weatherJobs";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send(`
        <div>
            <h1>API Endpoints</h1>
            <div>
                <h2>Circuits</h2>
                <p>GET /api/circuits → Get all circuits</p>
                <p>GET /api/circuits/:id → Get a single circuit</p>
                <p>POST /api/circuits → Create a circuit (Required Auth)</p>
                <p>PATCH /api/circuits/:id → Update a circuit (Required Auth)</p>
                <p>DELETE /api/circuits/:id → Soft delete a circuit (Required Auth)</p>
            </div>
            <div>
                <h2>Users</h2>
                <p>POST /api/users/register → Register new user</p>
                <p>POST /api/users/login → Login and receive token</p>
            </div>
            <div>
                <h2>Weather</h2>
                <p>GET /api/weather/update → Manual update weather for a circuit (Required Auth)</p>
                <p>(cron job automatically updates weather in DB)</p>
            </div>
        </div>
        `);
});

app.use("/api/circuit", circuitRoutes);
app.use("/api/user", userRoutes);
app.use("/api/weather", weatherRoutes);
startWeatherCron();

app.use(errorHandler);

export default app;
