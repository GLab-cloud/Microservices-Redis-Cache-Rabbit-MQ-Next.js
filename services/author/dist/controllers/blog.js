import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/trycatch.js";
import { v2 as cloudinary } from "cloudinary";
export const createBlog = TryCatch(async (req, res) => {
    const { title, description, blogcontent, category } = req.body;
    if (!title || !description || !blogcontent || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({ message: "No file to upload" });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({ message: "Failed to generate buffer" });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs",
    });
    const result = await sql `INSERT INTO blogs (title, description, blogcontent, image, category, author) VALUES (${title}, ${description}, ${blogcontent}, ${cloud.secure_url}, ${category}, ${req.user?._id}) RETURNING *`;
    return res.status(201).json({ message: "Blog created", blog: result[0] });
});
export const updateBlog = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { title, description, blogcontent, category } = req.body;
    if (!title || !description || !blogcontent || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const file = req.file;
    const blog = await sql `SELECT * FROM blogs WHERE id=${id} AND author=${req.user?._id}`;
    if (blog.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
    }
    if (blog[0].author !== req.user?._id) {
        return res.status(403).json({ message: "You are not authorized to update this blog" });
    }
    let imageUrl = blog[0].image;
    if (file) {
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            res.status(400).json({ message: "Failed to generate buffer" });
            return;
        }
        const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: "blogs",
        });
        imageUrl = cloud.secure_url;
    }
    const updatedBlog = await sql `UPDATE blogs SET title=${title}, description=${description}, blogcontent=${blogcontent}, image=${imageUrl}, category=${category} WHERE id=${id} AND author=${req.user?._id} RETURNING *`;
    return res.status(200).json({ message: "Blog updated", blog: updatedBlog[0] });
});
export const deleteBlog = TryCatch(async (req, res) => {
    const { id } = req.params;
    const blog = await sql `SELECT * FROM blogs WHERE id=${id} AND author=${req.user?._id}`;
    if (blog.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
    }
    if (blog[0].author !== req.user?._id) {
        return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }
    await sql `DELETE FROM blogs WHERE id=${id} AND author=${req.user?._id}`;
    await sql `DELETE FROM comments WHERE blogid=${id}`;
    await sql `DELETE FROM savedblogs WHERE blogid=${id}`;
    return res.status(200).json({ message: "Blog deleted" });
});
export const getAllBlogs = TryCatch(async (req, res) => {
    const blogs = await sql `SELECT * FROM blogs WHERE author=${req.user?._id}`;
    return res.status(200).json({ message: "Blogs fetched", blogs });
});
