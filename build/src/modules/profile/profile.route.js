"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraries
const express_1 = require("express");
// utils import
const asyncHandler_1 = require("../../utils/asyncHandler");
// controller
const profile_controller_1 = __importDefault(require("./profile.controller"));
// router
const profileRouter = (0, express_1.Router)();
// route(s)
profileRouter
    .route("/")
    .get((0, asyncHandler_1.asyncHandler)(profile_controller_1.default.fetchProfiles))
    .post((0, asyncHandler_1.asyncHandler)(profile_controller_1.default.createProfile));
profileRouter
    .route("/:id")
    .get((0, asyncHandler_1.asyncHandler)(profile_controller_1.default.fetchProfileById))
    .delete((0, asyncHandler_1.asyncHandler)(profile_controller_1.default.deleteProfileById));
exports.default = profileRouter;
