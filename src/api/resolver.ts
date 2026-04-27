import { ScriptManager } from '@callstack/repack/client';
import { ENV } from '../constants/env';

/**
 * ESAD Script Resolver
 * Handles Auth headers, DevMode overrides, and Local Linking (file://) protocol.
 * Call this ONCE at app startup (in App.tsx useEffect).
 *
 * @param devMode  Optional map of moduleId -> URL for dev / linked overrides.
 *                 Injected automatically by `esad dev` via esad.config.js devMode.
 */
export const setupResolver = (devMode?: Record<string, string>) => {
  ScriptManager.shared.addResolver(async (scriptId) => {
    // 1. Dev / Local-Link mode override
    if (devMode?.[scriptId]) {
      return {
        url: devMode[scriptId],
        cache: false,
      };
    }

    // 2. Production CDN resolution
    // Path convention: /cdn/:moduleId/production/index.bundle
    return {
      url: `${ENV.REGISTRY_URL}/cdn/${scriptId}/production/index.bundle`,
      headers: ENV.AUTH_TOKEN
        ? { Authorization: `Bearer ${ENV.AUTH_TOKEN}` }
        : {},
    };
  });
};
