import { sql } from "../utils/db.js";
import TryCatch from "../utils/trycatch.js";
import axios from "axios";
export const getAllBlogs = TryCatch(async (req, res) => {
    const { searchQuery, category } = req.query;
    let blogs;
    if (searchQuery && category) {
        blogs = await sql `SELECT * FROM blogs WHERE title ILIKE ${'%' + searchQuery + '%'} AND category = ${category} ORDER BY created_at DESC`;
    }
    else if (searchQuery) {
        blogs = await sql `SELECT * FROM blogs WHERE title ILIKE ${'%' + searchQuery + '%'} ORDER BY created_at DESC`;
    }
    else if (category) {
        blogs = await sql `SELECT * FROM blogs WHERE category = ${category} ORDER BY created_at DESC`;
    }
    else {
        blogs = await sql `SELECT * FROM blogs ORDER BY created_at DESC`;
    }
    res.status(200).json(blogs);
    console.log("Blogs fetched successfully", blogs);
});
export const getBlogById = TryCatch(async (req, res) => {
    const { id } = req.params;
    const blog = await sql `SELECT * FROM blogs WHERE id = ${id}`;
    if (blog.length === 0) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0].author}`);
    res.status(200).json({ blog: blog[0], author: data });
    console.log("Blog fetched successfully", { blog: blog[0], author: data });
});
