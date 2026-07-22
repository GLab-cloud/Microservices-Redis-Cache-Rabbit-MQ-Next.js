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
