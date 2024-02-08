import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string, referenceDate = new Date()): string {
  try {
    const date = new Date(dateString);
    const differenceInMilliseconds = referenceDate.getTime() - date.getTime();

    const differenceInSeconds = Math.abs(differenceInMilliseconds) / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = differenceInHours / 24;

    if (differenceInDays < 1) {
      if (differenceInHours < 1) {
        if (differenceInMinutes < 1) {
          return "just now";
        } else {
          return `${Math.round(differenceInMinutes)} minutes ago`;
        }
      } else {
        return `${Math.round(differenceInHours)} hours ago`;
      }
    } else {
      return `${Math.round(differenceInDays)} days ago`;
    }
  } catch (error) {
    // Handle potential errors with date parsing
    console.error("Error parsing date string:", error);
    return "Invalid date";
  }
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};