/**
 * Takes in string that can be null and ensures it is a string
 * @param str Nullable string
 * @param defaultStr String to default to if null
 * @returns blank string
 */
export const nullishString = (
  str: string | null,
  defaultStr?: string
): string => {
  return str !== null ? str : defaultStr !== undefined ? defaultStr : "";
};
