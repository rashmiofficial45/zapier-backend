import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types/zaptype";
import { prisma } from "../db/db";
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.id
  const body = req.body;
  const parsedData = ZapCreateSchema.safeParse(body);
  if (!parsedData || parsedData.data == undefined) {
    res.status(411).json({
      msg: "Invalid Input",
    });
    return;
  }
  const zap = await prisma.$transaction(async (tx) => {
    const zapInit = await tx.zap.create({
      data: {
        userId:id,
        trigger: {},
        actions: {
          create: parsedData.data.actions.map((x, index) => ({
            sortingOrder: index,
            actionId: x.actionId,
            action: x.action, // Ensure x.action exists and is of the correct type
            type: x.type, // Ensure x.type exists and is of the correct type
          })),
        },
        zapRun: { create: [] },
      },
    });
    const triggerInit = await tx.trigger.create({
      data: {
        zapId: zapInit.id,
        triggerId: parsedData.data.availableTriggerId,
      },
    });
    const zapUpdate = await tx.zap.update({
      where:{
        id:zapInit.id
      },
      data:{
        trigger: {
          connect: { id: triggerInit.id }
        }
      }
    })
  });
});

router.get("/", authMiddleware, (req, res) => {
  console.log("see the existing zap for a user");
});

router.get("/:zapId", authMiddleware, async (req, res) => {
  const { zapId } = await req.params;

  console.log("route to see the individual zap with zapId");
});
export const zapRouter = router;
