import { Router } from "express";
import { getCircuit, createCircuit, updateCircuit, deleteCircuit } from "../controllers/circuitController"

const router = Router();

router.get("/", getCircuit);
router.post("/", createCircuit);
router.patch("/update/:id", updateCircuit);
router.patch("/delete/:id", deleteCircuit);

export default router;