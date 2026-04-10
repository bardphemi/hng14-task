// third-party libraries
import express from "express";
import cors from "cors";
import httpStatus from "http-status";

// router
import mainRouter from "./modules";

// instantiate app
const app = express();

// middlewares 
app.use(cors());
app.use(express.json());
app.use(cors({
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// middlewar
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//routes
app.use("/api", mainRouter)
app.get("/health", (_req, res) => {
  return res
    .status(httpStatus.OK)
    .send({
      message: "API is healthy"
    });
});

export default app;
