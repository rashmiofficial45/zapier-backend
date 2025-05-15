import { NextFunction , Request , Response } from "express"

export function authMiddleware (req:Request,res:Response,next:NextFunction) {
    const token = req.headers.authorization
    console.log("auth middleware")
}