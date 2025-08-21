import express from "express";
import circuitRoutes from "./routes/circuitRoutes"
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("/api/circuits", circuitRoutes);

app.get("/", (req, res) => {
    res.send("Hello from app.ts")
})

app.use(errorHandler)

export default app