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
    (req as any).validated = {};
    const validations = [
      { key: "body", value: req.body },
      { key: "query", value: req.query },
      { key: "params", value: req.params },
    ];
    for (const { key, value } of validations) {
      if (schemas[key]) {
        const { value: validatedValue, error } = schemas[key].validate(value, {
          abortEarly: false,
          convert: true
        });
        if (error) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .send({
              status: false,
              message: `Validation error: ${error.details.map((d) => d.message)}`,
            });
        }
        (req as any).validated[key] = validatedValue;
      }
    }
    return next();
  };
};
