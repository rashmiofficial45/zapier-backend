import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types/zaptype";
import { prisma } from "../db/db";
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.id;
  const body = req.body;

  const parsedData = ZapCreateSchema.safeParse(body);
  if (!parsedData.success) {
    res.status(411).json({ msg: "Invalid Input" });
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      const zapInit = await tx.zap.create({
        data: {
          userId: id,
          actions: {
            create: parsedData.data.actions.map((x, index) => ({
              sortingOrder: index,
              action: x.action,
              actionId: x.actionId,
            })),
          },
          zapRun: { create: [] },
        },
      });

      await tx.trigger.create({
        data: {
          zapId: zapInit.id,
          triggerId: parsedData.data.availableTriggerId,
        },
      });
    });

    res.status(200).json({ msg: "Zap created successfully" });
  } catch (error) {
    console.error("Zap creation error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/", authMiddleware, (req, res) => {
  console.log("see the existing zap for a user");
});

router.get("/:zapId", authMiddleware, async (req, res) => {
  const { zapId } = await req.params;

  console.log("route to see the individual zap with zapId");
});
export const zapRouter = router;
