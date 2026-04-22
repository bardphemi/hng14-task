
// constants
import { AGE_GROUP_MAP, AGE_KEYWORDS, COUNTRY_MAP, GENDER_MAP } from "./constants";

/**
 * @description parse the query string
 * @param q 
 * @returns 
 */
export const parseSearchQuery = (q: string): any => {
  if (!q) return null;

  const query = q.toLowerCase();
  const filters: any = {};
  const containsWord = (term: string) =>
    new RegExp(`\\b${term.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`, "i").test(query);

  for (const key in GENDER_MAP) {
    if (containsWord(key)) {
      filters.gender = GENDER_MAP[key];
      break;
    }
  }
  for (const key in AGE_GROUP_MAP) {
    if (containsWord(key)) {
      filters.age_group = AGE_GROUP_MAP[key];
      break;
    }
  }
  for (const key in AGE_KEYWORDS) {
    if (containsWord(key)) {
      Object.assign(filters, AGE_KEYWORDS[key]);
    }
  }

  //
  const aboveMatch = query.match(/above\s+(\d+)/);
  if (aboveMatch) {
    filters.min_age = Number(aboveMatch[1]);
  }
  const belowMatch = query.match(/below\s+(\d+)/);
  if (belowMatch) {
    filters.max_age = Number(belowMatch[1]);
  }
  const betweenMatch = query.match(/between\s+(\d+)\s+and\s+(\d+)/);
  if (betweenMatch) {
    filters.min_age = Number(betweenMatch[1]);
    filters.max_age = Number(betweenMatch[2]);
  }

  //country map
  for (const country in COUNTRY_MAP) {
    if (containsWord(country)) {
      filters.country_id = COUNTRY_MAP[country];
      break;
    }
  }

  // handles when nothing gets parsed
  if (Object.keys(filters).length === 0) {
    return null;
  }

  return filters;
};
