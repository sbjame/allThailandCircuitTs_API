import express from "express";
import circuitRoutes from "./routes/circuitRoutes"
import userRoutes from "./routes/userRoutes"
import { errorHandler } from "./middlewares/errorHandler";
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

app.get("/", (req, res) => {
    res.send("Hello from app.ts")
})

app.use("/api/circuit", circuitRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler)

export default app