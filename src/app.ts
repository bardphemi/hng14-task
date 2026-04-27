// third-party libraries
import express, {
  urlencoded,
  json,
  Request,
  Response,
  NextFunction
} from "express";
import cors from "cors";
import httpStatus from "http-status";
import rateLimit from "express-rate-limit";

// router
import mainRouter from "./modules";
import authRouter from "./modules/auth/auth.route";

// middleware
import { globalErrorHandler } from "./middlewares/errorHandler";
import { authCheck } from "./middlewares/handleAccess";

// utils import
import logger from "./utils/logger";

// instantiate app
const app = express();
app.disable("x-powered-by");

// rate limiteers
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  statusCode: 429,
  message: { message: "Too many requests from this IP, please try again after a minute" },
  standardHeaders: true,
  legacyHeaders: false,
});
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  statusCode: 429,
  message: { message: "Too many requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

// logger
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  res.on("finish", () => {
    const timeInMs = (performance.now() - start).toFixed(2);
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${timeInMs}ms`);
  });

  next();
};

// middleware(s)
app.use(requestLogger);
app.use(urlencoded({ extended: true, limit: "10mb" }));
app.use(json({ limit: "10mb" }));
app.use(cors({
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// routes
app.get("/health", (_req, res) => {
  return res.status(httpStatus.OK).send({
    message: "API is healthy"
  });
});
app.use("/auth", authLimiter, authRouter);
app.use("/api", generalLimiter, authCheck, mainRouter);
app.use(globalErrorHandler);

export default app;
