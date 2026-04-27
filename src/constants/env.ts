/**
 * App-wide constants.
 * These reference environment variables loaded via react-native-dotenv
 * (or any other .env loader configured in babel.config.js).
 */
export const ENV = {
  /** Base URL for the Simple-CDN or any compatible registry */
  REGISTRY_URL: process.env.EXPO_PUBLIC_REGISTRY_URL ?? 'http://localhost:3000',

  /** Auth token for authenticated requests. Never hardcode this. */
  AUTH_TOKEN: process.env.EXPO_PUBLIC_REGISTRY_AUTH_TOKEN ?? '',
};
