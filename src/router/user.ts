import { Router } from "express";
import { authMiddleware } from "../middleware";
import { signInSchema, signUpSchema } from "../types/auth";
import { prisma } from "../db/db";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const parsedData = signUpSchema.safeParse(body);
    if (!parsedData.success) {
      res.status(411).json({
        msg: "Invalid Input",
      });
      return;
    }
    if (!parsedData.data) {
      throw new Error("data is not provided");
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });
    if (existingUser) {
      res.status(403).json({
        msg: "User already exists",
      });
      return;
    }
    const user = await prisma.user.create({
      data: {
        email: parsedData.data.email,
        name: parsedData.data.username,
        password: parsedData.data.password,
      },
    });
    if (user) {
      console.log("user created");
    }
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const body = req.body;
    const parsedData = signInSchema.safeParse(body);
    if (!parsedData.success) {
      res.status(411).json({
        msg: "Invalid Inputs",
      });
      return;
    }
    const validUser = await prisma.user.findFirst({
      where: {
        email: parsedData.data?.email,
        password: parsedData.data?.password,
      },
    });
    if (!validUser) {
      res.json({
        message: "User is Not found",
      });
      return;
    }
    //sign the token
    const token = jwt.sign(
      {
        id: validUser?.id,
      },
      "secret"
    );
    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const id = req.id;

    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        zap:true,
      },
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export const userRouter = router;
