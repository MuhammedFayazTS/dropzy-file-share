import { avatarBotNames, robotNames, tailwindColors } from "@/constants/data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import android from "../assets/images/android.png";
import ios from "../assets/images/ios.png";
import computer from "../assets/images/computer.png";
import user from "../assets/images/user.png";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomUserName = (): string => {
  const randomIndex = Math.floor(Math.random() * robotNames.length);
  return robotNames[randomIndex];
};

export const generateRandomAvatar = () => {
  const maxRandomNumber = avatarBotNames.length;
  const seed = avatarBotNames[Math.floor(Math.random() * maxRandomNumber)];
  return `https://api.dicebear.com/8.x/bottts-neutral/png?seed=${seed}`;
};

export const getPlatformLogo = (platform: string): string => {
  switch (platform) {
    case "Android":
      return android;
    case "ios":
      return ios;
    case "Windows":
      return computer;
    case "MacOS":
      return computer;
    default:
      return user;
  }
};

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * tailwindColors.length);
  return tailwindColors[randomIndex];
};

export const randomPositionOfUser = () => {
  return {
    top: `${Math.floor(Math.random() * 80)}%`,
    left: `${Math.floor(Math.random() * 80)}%`,
  };
};

export function getFileType(file: File): string {
  if (!file) return "unknown";
  return file.type.split("/")[0];
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytes" : sizes[i] ?? "Bytes"
  }`;
}
