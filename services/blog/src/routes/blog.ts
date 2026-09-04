import express from "express";
import { getAllBlogs, getBlogById } from "../controllers/blog.js";
const router = express.Router();
router.get("/blog/all", getAllBlogs);
router.get("/blog/:id", getBlogById);
router.get("/blog/saved/all", getAllBlogs);

export default router;