// third-party libraries
import { parser } from "stream-json";
import { chain } from "stream-chain";
import { pick } from "stream-json/filters/pick.js";
import { streamArray } from "stream-json/streamers/stream-array.js";
import multer from "multer";
import httpStatus from "http-status";
import path from "path";
import fs from 'fs';

// utils
import logger from "./logger";
import { AppError } from "./appError";
import { profileSchema } from "./validationSchema";

export const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    logger.info(`Received file: ${file.originalname} (${file.mimetype})`);
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = [".json", ".csv"];
    const allowedMimeTypes = ["application/json", "text/csv"];
    if (allowedMimeTypes.includes(file.mimetype) && allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      const error = new AppError(
        "Invalid file type",
        httpStatus.BAD_REQUEST
      );

      cb(error as any, false);
    }
  }
});


/**
 * @description hadnles file streaming
 * @param filePath 
 * @param onBatch 
 * @returns 
 */
export const processProfilesStreamFromFile = async (
  filePath: string,
  onBatch: (batch: any[]) => Promise<void>
) => {
  return new Promise<void>((resolve, reject) => {
    const pipeline = chain([
      fs.createReadStream(filePath),
      parser(),
      pick({ filter: "profiles" }),
      streamArray(),
    ]);

    let batch: any[] = [];
    pipeline.on("data", async ({ value }) => {
      const { error, value: validated } = profileSchema.validate(value);
      if (error) return;
      batch.push(validated);
      if (batch.length >= 1000) {
        pipeline.pause();
        onBatch(batch)
          .then(() => {
            batch = [];
            pipeline.resume();
          })
          .catch(reject);
      }
    });
    pipeline.on("end", async () => {
      if (batch.length) await onBatch(batch);
      resolve();
    });

    pipeline.on("error", reject);
  });
}

