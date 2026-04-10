// third-party libraries
import axios from "axios";
import httpStatus from "http-status";

// utility functions
import { getConfidence } from "../../utils/nameUtil";
import { AppError } from "../../utils/appError";
import { axiosInstance } from "../../utils/axiosUtil";

// interface
import { GenderizeResponse } from "./classify.interface";

// cache variables
const cache = new Map<string, any>();
const TTL = 1000 * 60 * 60;

// environment variables
const {
  GENDERIZE_URL
} = process.env;

// 
const classifyService = {
  /**
   * @description predicts gender
   * @param name 
   * @returns 
   */
  async predictGender(name: string) {
    const apiUrl = `${GENDERIZE_URL}?name=${name}`;
    try {
      //check cache for existing record
      const cached = cache.get(name);
      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      }
      
      const { data } = await axiosInstance.get<GenderizeResponse>(apiUrl);
      const processed_at = new Date().toISOString();

      //handle edge casess
      if (!data.gender || data.count === 0) {
        throw new AppError(
          "No prediction available for the provided name",
          httpStatus.UNPROCESSABLE_ENTITY
        );
      }
      const is_confident: boolean = getConfidence(
        data.probability,
        data.count
      );
      const result = {
        name: data.name,
        gender: data.gender,
        sample_size: data.count,
        probability: data.probability,
        is_confident,
        processed_at
      }
      cache.set(name, {
        value: result,
        expiry: Date.now() + TTL
      });
      return result;
    } catch (error: any) {
      if (error.response) {
        throw new AppError(
          "Upstream service error",
          httpStatus.BAD_GATEWAY
        );
      }
      if (error instanceof AppError) {
        throw error;
      }

      //handle axios error
      if (error.response) {
        throw new AppError(
          "Upstream service error",
          httpStatus.BAD_GATEWAY
        );
      }

      const errorMsg =
        error instanceof Error
          ? error.message
          : "Internal Server Error";
      throw new AppError(
        errorMsg,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default classifyService;
