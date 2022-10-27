import express from "express";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import User from "../model/user.schema";
import genToken from "../utils/gen.token";
import { registerValidator, signInValidator } from "../utils/validator";

const router = express.Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password, group } = registerValidator.parse(req.body);
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(400).json({ msg: "User already exists" });
    } 
    if (!group.includes('admin') && !group.includes('user') && !group.includes('guest')) {
      res.status(400).json({ msg: "Invalid group" });
    }
    const id = uuidv4();
    try {
      await User.create({
        id,
        email,
        password,
        group,
      });
      res.status(201).json({ msg: "User created" });
    } catch (error) {
      res.status(400).json({ msg: "User not created" });
    }
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = signInValidator.parse(req.body);
    if (!email || !password) {
      res.status(400).json({ msg: "Please enter all fields" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User does not exist");
    }
    const isValid = user.validPassword(password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }
    try {
      const token = genToken(user.id);
      res.status(200).json({ token });
    } catch (error) {
      throw new Error("Try login again");
    }
  })
);

export default router;
