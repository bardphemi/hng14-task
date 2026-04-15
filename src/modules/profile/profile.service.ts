// third-party libraries
import httpStatus from "http-status";
import { randomUUID } from "node:crypto";



// data access object
import profileDao from "./profile.dao";

// service import
import classifyService from "../classify/classify.service";

// interface
import { AgeGroup, AgifyResponse, FetchProfilesParams, NationalityResponse } from "./profile.interface";

// utils import
import { axiosInstance } from "../../utils/axiosUtil";
import { AppError } from "../../utils/appError";

// environment variables
const {
  NATIONALIZE_API_URL,
  AGIFY_API_URL
} = process.env;

//
const profileService = {
  /**
   * @description fetches profiles based on optional filters
   * @param params 
   * @returns 
   */
  async fetchProfiles(params: FetchProfilesParams) {
    return await profileDao.fetchProfiles(params);
  },

  /**
   * @description creates user profile from name
   * @param name 
   */
  async createProfile(name: string) {
    const { gender, sample_size, probability } = await classifyService.predictGender(name);
    const { age, age_group } = await this.getAge(name);
    const { country_id, country_probability } = await this.getNationality(name);
    const profileDto = {
      id: randomUUID(),
      name,
      gender,
      gender_probability: probability,
      sample_size,
      age,
      age_group,
      country_id,
      country_probability
    }
    return await profileDao.createOrGetProfile(profileDto);
  },

  /**
   * @description gets age and age group from name
   * @param name 
   * @returns 
   */
  async getAge(name: string) {
    const apiUrl = `${AGIFY_API_URL}?name=${name}`;
    try {
      const { data } = await axiosInstance.get<AgifyResponse>(apiUrl);
      const age = Number(data.age);
      if (age === null || age === undefined) {
        throw new AppError(
          "Agify returned an invalid response",
          httpStatus.BAD_GATEWAY
        );
      }
      let age_group: AgeGroup;
      if (age >= 0 && age <= 12) {
        age_group = "child";
      } else if (age >= 13 && age <= 19) {
        age_group = "teenager";
      } else if (age >= 20 && age <= 59) {
        age_group = "adult";
      } else {
        age_group = "senior";
      }
      return {
        age,
        age_group,
      };
    } catch (error: any) {
      if (error.response) {
        throw new AppError(
          "Upstream or server failure",
          httpStatus.BAD_GATEWAY
        );
      }
      if (error instanceof AppError) {
        throw error;
      }

      //axios error
      if (error.response) {
        throw new AppError(
          "Upstream or server failure",
          httpStatus.BAD_GATEWAY
        );
      }
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Upstream or server failure";
      throw new AppError(
        errorMsg,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description gets nationality and country id using name
   * @param name 
   */
  async getNationality(name: string) {
    const apiUrl = `${NATIONALIZE_API_URL}?name=${name}`;
    try {
      const { data } = await axiosInstance.get<NationalityResponse>(apiUrl);
      const { country } = data;
      if (!country || country.length === 0) {
        throw new AppError(
          "Nationalize returned an invalid response",
          httpStatus.BAD_GATEWAY
        );
      };
      let max = country[0];
      for (let i = 1; i < country.length; i++) {
        if (country[i].probability > max.probability) {
          max = country[i];
        }
      }
      return {
        country_id: max.country_id,
        country_probability: Number(max.probability.toFixed(2)),
      };
    } catch (error: any) {
      if (error.response) {
        throw new AppError(
          "Upstream or server failure",
          httpStatus.BAD_GATEWAY
        );
      }
      if (error instanceof AppError) {
        throw error;
      }
      if (error.response) {
        throw new AppError(
          "Upstream or server failure",
          httpStatus.BAD_GATEWAY
        );
      }
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Upstream or server failure";
      throw new AppError(
        errorMsg,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description fetches profile by name
   * @param name 
   * @returns 
   */
  async fetchProfileByName(name:string){
    return await profileDao.fetchProfileByName(name);
  }
}

export default profileService;
