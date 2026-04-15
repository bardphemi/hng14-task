"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraire 
const express_1 = require("express");
// router(s)
const classify_route_1 = __importDefault(require("./classify/classify.route"));
const profile_route_1 = __importDefault(require("./profile/profile.route"));
const mainRouter = (0, express_1.Router)();
// route(s)
mainRouter.use("/classify", classify_route_1.default);
mainRouter.use("/profiles", profile_route_1.default);
exports.default = mainRouter;
