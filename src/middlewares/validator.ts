// third-party modules
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

// interface
type ValidationSchemas = {
  [key: string]: Schema;
};

/**
 * @description Middleware for validating request data
 * @param schemas 
 * @returns 
 */
export const validator = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validations = [
      { key: "body", value: req.body },
      { key: "query", value: req.query },
      { key: "params", value: req.params },
    ];
    for (const { key, value } of validations) {
      if (schemas[key]) {
        const { error } = schemas[key].validate(value, { abortEarly: false });
        if (error) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({
              status: false,
              message: `Validation error: ${error.details.map((d) => d.message)}`,
            });
        }
      }
    }
    return next();
  };
};
