import "@/common/config/config";
export function logger(key: string, data: unknown) {
  if (process.env.LOGGER === "true") {
    console.log(`${key}:`, data);
  }
}
