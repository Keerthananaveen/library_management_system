import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { borrowBook, returnBook, getBorrowRecords } from "../controllers/borrowC.js";

const router = Router();

router.use(authenticateToken);
router.get("/", getBorrowRecords);
router.post("/", borrowBook);
router.put("/return/:id", returnBook);

export default router;