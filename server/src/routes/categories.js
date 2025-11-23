import express from "express";
import { listCategories, createCategory } from "../controllers/categoryController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/", listCategories);
router.post("/", auth, createCategory);

export default router;
