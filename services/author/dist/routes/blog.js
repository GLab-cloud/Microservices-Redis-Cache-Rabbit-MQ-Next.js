import express from "express";
import uploadFile from "../middlewares/multer.js";
import { createBlog } from "../controllers/blog.js";
import { isAuth } from "../middlewares/isAuth.js";
const router = express.Router();
router.post("/blog/new", isAuth, uploadFile, createBlog);
export default router;
