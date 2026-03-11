function validateEnvConfig() {
  const CONFIG = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  };
  const missingKeys = Object.entries(CONFIG).filter(([key, value]) => !value);
  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingKeys.map(([key]) => key).join(", ")}`,
    );
  }
  return CONFIG as Record<keyof typeof CONFIG, string>;
}

const ENV_CONFIG = validateEnvConfig();

export default ENV_CONFIG;
