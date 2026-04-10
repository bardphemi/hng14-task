// third-party libraries
import express, {
  urlencoded,
  json
} from "express";
import cors from "cors";
import httpStatus from "http-status";

// router
import mainRouter from "./modules";

// middleware
import { globalErrorHandler } from "./middlewares/errorHandler";

// instantiate app
const app = express();
app.disable("x-powered-by");

// middleware(s)
app.use(urlencoded({ extended: true, limit: "10mb" }));
app.use(json({ limit: "10mb" }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// routes
app.use("/api", mainRouter);
app.get("/health", (_req, res) => {
  return res.status(httpStatus.OK).send({
    message: "API is healthy"
  });
});


app.use(globalErrorHandler);

export default app;
