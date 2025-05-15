import { Router } from "express";
import { authMiddleware } from "../middleware";
const router = Router();

router.post("/",authMiddleware, (req,res) => {
  console.log("create a zap for a user");
});

router.get("/", authMiddleware, (req, res) => {
  console.log("see the existing zap for a user");
});

router.get("/zapId:", authMiddleware , (req,res)=>{
  console.log("route to see the individual zap with zapId")
})
export const zapRouter = router;
