// third-party libraries
import { randomUUID } from "node:crypto";

/**
 * @description removes duplicates from array of profiles
 * @param items 
 * @param getKey 
 * @returns 
 */
export const dedupe = <T extends Record<string, any>>(
  items: T[],
  getKey: (item: T) => string
): (T & { id: string })[] => {
  const seen = new Set<string>();

  return items.reduce((acc, item) => {
    const key = getKey(item).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      acc.push({
        ...item,
        id: randomUUID(),
      });
    }
    return acc;
  }, [] as (T & { id: string })[]);
};
