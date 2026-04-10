// third-party libraries
import axios from "axios";
import httpStatus from "http-status";

// utility functions
import { getConfidence } from "../../utils/nameUtil";
import { AppError } from "../../utils/appError";

// interface
import { GenderizeResponse } from "./classify.interface";

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
      const { data } = await axios.get<GenderizeResponse>(apiUrl);
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
      return {
        name: data.name,
        gender: data.gender,
        sample_size: data.count,
        probability: data.probability,
        is_confident,
        processed_at
      }
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
