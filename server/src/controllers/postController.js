import Post from "../models/Post.js";
import slugify from "slugify";

/**
 * GET /api/posts
 * supports: ?page=1&limit=10&search=term&category=catId
 */
export async function getPosts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } }
      ];
    }
    if (req.query.category) filter.category = req.query.category;

    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .populate("author", "username")
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    res.json({ total, page, limit, data: posts });
  } catch (err) { next(err); }
}

export async function getPostById(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username").populate("category", "name");
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch (err) { next(err); }
}

export async function createPost(req, res, next) {
  try {
    const { title, content, category, tags } = req.body;
    const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString(36).slice(-4);
    const featuredImage = req.file ? `/uploads/${req.file.filename}` : undefined;
    const post = await Post.create({
      title, slug, content, author: req.user.id, category,
      tags: tags ? tags.split(",").map(s => s.trim()) : [], featuredImage
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
}

export async function updatePost(req, res, next) {
  try {
    const update = { ...req.body };
    if (req.file) update.featuredImage = `/uploads/${req.file.filename}`;
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch (err) { next(err); }
}

export async function deletePost(req, res, next) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
}

export async function addComment(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    post.comments.push({ author: req.user.username || "Anonymous", text: req.body.text });
    await post.save();
    res.status(201).json(post);
  } catch (err) { next(err); }
}
