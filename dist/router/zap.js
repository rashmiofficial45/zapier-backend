"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const zaptype_1 = require("../types/zaptype");
const db_1 = require("../db/db");
const router = (0, express_1.Router)();
router.post("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = zaptype_1.ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(411).json({ msg: "Invalid Input" });
        return;
    }
    try {
        yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const zapInit = yield tx.zap.create({
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
            yield tx.trigger.create({
                data: {
                    zapId: zapInit.id,
                    triggerId: parsedData.data.availableTriggerId,
                },
            });
        }));
        res.status(200).json({ msg: "Zap created successfully" });
    }
    catch (error) {
        console.error("Zap creation error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("see the existing zap for a user");
    //@ts-ignore
    const id = req.id;
    try {
        const zaps = yield db_1.prisma.zap.findMany({
            where: {
                userId: id
            },
            select: {
                id: true,
                trigger: {
                    include: {
                        type: true
                    }
                },
                userId: true,
                actions: true
            }
        });
        res.status(200).json({
            zaps
        });
    }
    catch (error) {
        console.error("Invalid User", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
router.get("/:zapId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { zapId } = yield req.params;
    //@ts-ignore
    const id = req.id;
    try {
        const zapDetails = yield db_1.prisma.zap.findFirst({
            where: {
                id: zapId,
                userId: id
            },
            select: {
                trigger: true,
                actions: true,
                zapRun: true,
            },
        });
        if (!zapDetails) {
            res.status(403).json({
                msg: "Invalid zap",
            });
        }
        res.status(200).json({
            zapDetails,
        });
    }
    catch (error) {
        console.error("Invalid Zap", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
exports.zapRouter = router;
