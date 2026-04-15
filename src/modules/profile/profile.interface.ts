export interface FetchProfilesParams {
  gender?: string | any;
  countryId?: string | any;
  ageGroup?: string | any;
};

export interface AgifyResponse {
  name: string;
  age: number | null;
  count: number;
};

export type AgeGroup = "child" | "teenager" | "adult" | "senior";
export interface ClassifiedAge {
  age: number | null;
  age_group: AgeGroup | null;
};

export interface CountryProb {
  country_id: string;
  probability: number;
};

export interface NationalityResponse {
  count: number;
  name: string;
  country: CountryProb[];
};

export interface ProfileDTO {
  id: string;
  name: string
  gender: string
  gender_probability: number;
  sample_size: number
  age: number,
  age_group: string;
  country_id: string;
  country_probability: number
};

