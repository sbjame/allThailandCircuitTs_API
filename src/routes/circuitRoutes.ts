import { Router } from "express";
import { getCircuit, createCircuit, updateCircuit, deleteCircuit } from "../controllers/circuitController"
import { auth, requireAdmin, requireAdminOrManager } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

const router = Router();

router.get("/", getCircuit);
router.post("/", upload.fields([{name: "images", maxCount: 5}, {name: "thumbnail", maxCount: 1}]), auth, requireAdminOrManager, createCircuit);
router.patch("/update/:id", auth, requireAdminOrManager, updateCircuit);
router.patch("/delete/:id", auth, requireAdminOrManager, deleteCircuit);

export default router;