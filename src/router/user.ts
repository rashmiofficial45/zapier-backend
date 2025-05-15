import { json, Router } from "express";
import { authMiddleware } from "../middleware";
import { signInSchema, signUpSchema } from "../types/auth";
import { prisma } from "../db/db";
const router = Router();
import jwt from "jsonwebtoken"


router.post("/signup", async (req, res) => {
  console.log("signup to create a zap");
  const body = req.body
  const parsedData = signUpSchema.safeParse(body)
  if (!parsedData.success){
    res.status(411).json({
      msg:"Invalid Input"
    })
  }
  if (!parsedData.data){
    throw new Error("data is not provided")
  }
  const existingUser = await prisma.user.findFirst({
    where:{
      email:parsedData.data.email,
    }
  })
  if (existingUser){
    res.status(403).json({
      msg:"User already exists"
    })
  }
  const user = await prisma.user.create({
    data:{
      email:parsedData.data.email,
      name:parsedData.data.username,
      password:parsedData.data.password
    }
  })
  if (user){
    console.log("user created")
  }
  res.status(200).json({
    user: user,
  });
});



router.post("/signin", async(req,res) => {
  console.log("signin to create a zap");
  const body = req.body
  const parsedData = signInSchema.safeParse(body)
  if (!parsedData.success) {
    res.status(411).json({
      msg:"Invalid Inputs"
    })
  }
  const validUser = await prisma.user.findFirst({
    where:{
      email:parsedData.data?.email,
      password:parsedData.data?.password
    }
  })
  if(validUser){
    res.json({
      message:"user signedIn"
    })
  }
  //sign the token
  const token = jwt.sign({
    id:validUser?.id
  },"secret")
  res.status(200).json({
    token
  })
});


router.get("/user", authMiddleware , async(req,res)=>{
    console.log("authenticated user")
    //@ts-ignore
    const id = req.id
    const user = prisma.user.findFirst({
      where:{
        id
      },
      select:{
        email:true,
        name:true
      }
    })
    res.status(200).json({
      user
    })
})


export const userRouter = router;
