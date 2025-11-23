import { body } from "express-validator";

export const createPostValidator = [
  body("title").isLength({ min: 3 }).withMessage("Title at least 3 chars"),
  body("content").isLength({ min: 10 }).withMessage("Content at least 10 chars"),
  body("category").optional().isMongoId().withMessage("Category must be ID")
];
