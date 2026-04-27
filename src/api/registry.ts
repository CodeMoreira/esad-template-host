import { ENV } from '../constants/env';

export interface RemoteModule {
  id: string;
  name: string;
  active_version: string | null;
  urls: {
    dev: string | null;
    staging: string | null;
    production: string | null;
  };
}

/**
 * Fetches the list of available remote modules from the registry.
 * This is a generic function — works with Simple-CDN or any compatible
 * registry that follows the ESAD contract.
 *
 * @returns Promise<RemoteModule[]>
 */
export async function getRegistry(): Promise<RemoteModule[]> {
  const response = await fetch(`${ENV.REGISTRY_URL}/modules`, {
    headers: ENV.AUTH_TOKEN
      ? { Authorization: `Bearer ${ENV.AUTH_TOKEN}` }
      : {},
  });

  if (!response.ok) {
    throw new Error(`Registry fetch failed: ${response.status}`);
  }

  return response.json();
}
