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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const auth_1 = require("../types/auth");
const db_1 = require("../db/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const parsedData = auth_1.signUpSchema.safeParse(body);
        if (!parsedData.success) {
            res.status(411).json({
                msg: "Invalid Input",
            });
            return;
        }
        if (!parsedData.data) {
            throw new Error("data is not provided");
        }
        const existingUser = yield db_1.prisma.user.findFirst({
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
        const user = yield db_1.prisma.user.create({
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
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const body = req.body;
        const parsedData = auth_1.signInSchema.safeParse(body);
        if (!parsedData.success) {
            res.status(411).json({
                msg: "Invalid Inputs",
            });
            return;
        }
        const validUser = yield db_1.prisma.user.findFirst({
            where: {
                email: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.email,
                password: (_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password,
            },
        });
        if (!validUser) {
            res.json({
                message: "User is Not found",
            });
            return;
        }
        //sign the token
        const token = jsonwebtoken_1.default.sign({
            id: validUser === null || validUser === void 0 ? void 0 : validUser.id,
        }, "secret");
        res.status(200).json({
            token,
        });
    }
    catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        const user = yield db_1.prisma.user.findFirst({
            where: { id },
            select: {
                email: true,
                name: true,
            },
        });
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
exports.userRouter = router;
