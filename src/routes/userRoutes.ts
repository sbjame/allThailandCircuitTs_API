import { Router } from "express"
import { getUser, registerUser, updatePassword, updateName, deleteUser, loginUser, changeRole, getUserById } from "../controllers/userController"
import {auth, requireAdmin} from "../middlewares/auth"

const router = Router();

router.get("/", auth, getUser);
router.get("/me", auth, getUserById);
router.post("/", registerUser);
router.patch("/update/password/me", auth, updatePassword)
router.patch("/update/name/me", auth, updateName)
router.patch("/update/:id/role", auth, requireAdmin, changeRole);
router.patch("/delete/:id", deleteUser);
router.post("/login", loginUser);

export default router;