import Category from "../models/Category.js";

export async function listCategories(req, res, next) {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) { next(err); }
}

export async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    const cat = await Category.create({ name });
    res.status(201).json(cat);
  } catch (err) { next(err); }
}
