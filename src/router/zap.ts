import { Router } from "express";
import { authMiddleware } from "../middleware";
const router = Router();
router.get("/",authMiddleware, (req,res) => {
  console.log("get route in zap");
});
router.post("/",authMiddleware, (req,res) => {
  console.log("post route in zap");
});
export const zapRouter = router;
