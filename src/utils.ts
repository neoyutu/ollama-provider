import { formatEther, parseEther } from "ethers";

export const getCurrentUTCTime = (): number => {
  return parseInt((new Date().getTime() / 1000).toString());
};
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function formatSol(x: bigint) {
  return formatEther(x * BigInt(1000000000))
}

export function parseSol(x: string) {
  return parseEther(x) / BigInt(1000000000)
}