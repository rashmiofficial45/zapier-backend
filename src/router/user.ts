import { Router } from "express";
import { authMiddleware } from "../middleware";
const router = Router();
router.post("/signin", (req,res) => {
  console.log("signin to create a zap");
});
router.post("/signup", (req,res) => {
  console.log("signup to create a zap");
});
router.get("/user", authMiddleware , ()=>{
    console.log("authenticated user")
})
export const userRouter = router;
