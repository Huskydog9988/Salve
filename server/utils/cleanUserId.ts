/**
 * Clean user id with p at the start of legacy ids
 * @param userId
 * @returns clean user id
 */
export function cleanUserId(userId: string): string {
  userId = userId.trim();

  if (userId[0].toLowerCase() === "p") {
    userId = userId.substring(1);
  }

  console.log(userId);

  return userId;
}
