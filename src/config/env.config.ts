export const APP_TYPES = [
  "turfmanagement",
  "events",
  "eventsmanagement",
] as const;

export type AppType = (typeof APP_TYPES)[number];

function validateEnvConfig() {
  const CONFIG = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    APP_TYPE: process.env.NEXT_PUBLIC_APP_TYPE,
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME?.trim(),
    GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  };

  const missingKeys = Object.entries(CONFIG).filter(([, value]) => !value);
  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingKeys.map(([key]) => key).join(", ")}`,
    );
  }

  if (!APP_TYPES.includes(CONFIG.APP_TYPE as AppType)) {
    throw new Error(
      `NEXT_PUBLIC_APP_TYPE must be one of: ${APP_TYPES.join(", ")}`,
    );
  }

  return CONFIG as {
    API_BASE_URL: string;
    APP_TYPE: AppType;
    APP_NAME: string;
    GOOGLE_MAPS_API_KEY: string;
  };
}

const ENV_CONFIG = validateEnvConfig();

export default ENV_CONFIG;
