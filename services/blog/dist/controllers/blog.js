import { sql } from "../utils/db.js";
import TryCatch from "../utils/trycatch.js";
export const getAllBlogs = TryCatch(async (req, res) => {
    let blogs;
    blogs = await sql `SELECT * FROM blogs ORDER BY created_at DESC`;
    res.status(200).json(blogs);
    console.log("Blogs fetched successfully", blogs);
});
