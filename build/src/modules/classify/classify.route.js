"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraries
const express_1 = require("express");
// comntroller
const classify_controller_1 = __importDefault(require("./classify.controller"));
// utils
const asyncHandler_1 = require("../../utils/asyncHandler");
// router instance
const classifyRouter = (0, express_1.Router)();
// rourtes
classifyRouter.get("/", (0, asyncHandler_1.asyncHandler)(classify_controller_1.default.predictGender));
exports.default = classifyRouter;
