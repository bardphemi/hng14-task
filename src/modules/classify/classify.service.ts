// third-party libraries
import axios from "axios";

// utility functions
import logger from "../../utils/logger";
import { getConfidence } from "../../utils/nameUtil";

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
      const processed_at = new Date().toISOString();
      const { data } = await axios.get<GenderizeResponse>(apiUrl);
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
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
      logger.error(`Error occurred while fetching gender data: ${errorMsg}`);
      throw new Error(`${errorMsg}`)
    }
  }
}

export default classifyService;
