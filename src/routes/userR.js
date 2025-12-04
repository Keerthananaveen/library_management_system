import { Router } from "express";
import { getUsers, getProfile } from "../controllers/userC.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

router.use(authenticateToken);
router.get("/", getUsers);
router.get("/profile", getProfile);

export default router;