import { Router } from "express";
import { updateWeather } from "../controllers/weatherController";
import { auth, requireAdminOrManager } from "../middlewares/auth";

const router = Router();
router.get("/update", auth, requireAdminOrManager, updateWeather)

export default router;