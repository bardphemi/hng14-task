// data access object
import profileDao from "./profile.dao";

// interface
import { FetchProfilesParams } from "./profile.interface";

//
const profileService = {
  /**
   * @description fetches profiles based on optional filters
   * @param params 
   * @returns 
   */
  async fetchProfiles(params: FetchProfilesParams) {
    return await profileDao.fetchProfiles(params);
  }
}

export default profileService;
