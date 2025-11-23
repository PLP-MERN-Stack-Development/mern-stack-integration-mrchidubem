import express from "express";
import {
  getPosts, getPostById, createPost, updatePost, deletePost, addComment
} from "../controllers/postController.js";

import auth from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createPostValidator } from "../validators/postValidator.js";
import { validationResult } from "express-validator";

const router = express.Router();

function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", auth, upload.single("featuredImage"), createPostValidator, runValidation, createPost);
router.put("/:id", auth, upload.single("featuredImage"), updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/comments", auth, addComment);

export default router;
