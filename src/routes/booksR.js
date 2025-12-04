import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { createBook, getBooks, getBookById, updateCopies } from "../controllers/booksC.js";

const router = Router();

router.use(authenticateToken);
router.post("/", createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", updateCopies);

export default router;