import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization as unknown as string;
  if (!token) {
    res.status(411).json({
        msg:"Invalid Token"
    })
    return
  }
  try {
    const payload = jwt.verify(token, "secret");
    if (payload){
      //@ts-ignore
      req.id = payload.id
      next()
    }
  } catch (error) {
    throw new Error("You are not Logged In ")
  }
}
