import { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const loginUser = async (reg: Request, res: Response) => {
  try {
    const { email, name, image } = reg.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, image });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "5d",
    });
    res.status(200).json({ message: "Login success", token, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
