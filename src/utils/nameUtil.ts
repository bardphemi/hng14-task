
/**
 * @description Utility function to determine confidence
 * @param probability 
 * @param sampleSize 
 * @returns 
 */
export const getConfidence = (
  probability: number,
  sampleSize: number
): boolean => {
  if (probability >= 0.7 && sampleSize >= 100) {
    return true;
  }
  return false;
};
