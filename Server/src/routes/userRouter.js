const express = require("express");
const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../database");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const userRouter = express.Router();
const mongoose = require("mongoose");

const userZodSchema = zod.object({
  userName: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const signInSchema = zod.object({
  userName: zod.string().email(),
  password: zod.string(),
});

const updateSchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

userRouter.post("/signup", async (req, res) => {
  console.log("Received signUp request");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { success } = userZodSchema.safeParse(req.body);
    if (!success) {
      return res
        .status(411)
        .json({ message: "Failed to validate the payload" });
    }

    const existingUser = await User.findOne({
      userName: req.body.userName,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "User already exists, try with a different username",
      });
    }
    const saltRounds = 5;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      userName: req.body.userName,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    await Account.create({
      userId: user._id,
      balance: Math.floor(1 + Math.random() * 10000),
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    await session.commitTransaction();
    console.log("Sign up successful");
    return res.status(200).json({ body: "User created successfully", token });
  } catch (err) {
    await session.abortTransaction();
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
});

userRouter.post("/signIn", async (req, res) => {
  console.log("Received sign in request");
  try {
    const { success } = signInSchema.safeParse(req.body);

    if (!success) {
      return res.status(411).json({ messsge: "Failed to validate payload" });
    }

    const user = await User.findOne({
      userName: req.body.userName,
    });

    if (!user) {
      res
        .status(401)
        .json({ message: `User with username ${req.body.userName} not found` });
    }

    const passWordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passWordMatch) {
      res.status(401).json({ message: "User authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    console.log("Created token");
    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
});

userRouter.put("/update", authMiddleware, async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ message: "Payload validation failed" });
  }
  const { userId } = req;

  await User.updateOne(
    {
      _id: userId,
    },
    req.body
  );

  res.status(201).json({ message: "Modified successfully" });
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
  let users = await User.find({
    $or: [
      {
        firstName: {
          $regex: req.query.filter,
        },
      },
      {
        lastName: {
          $regex: req.query.filter,
        },
      },
    ],
  });

  users = users.filter((user) => user._id != req.userId);

  res.json({
    users: users.map((user) => ({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = userRouter;
