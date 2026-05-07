/**
 * RemoteConfig Service
 * Singleton to manage dynamic remote URLs and authentication tokens.
 */
class RemoteConfigService {
  private remotes: Record<string, string> = {};
  private authToken: string | null = null;

  /**
   * Updates the authentication token.
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Sets the map of available remotes.
   * @param remotesMap Format: { "module_id": "url" }
   */
  setRemotes(remotesMap: Record<string, string>): void {
    this.remotes = remotesMap;
  }

  /**
   * Returns the entire map of registered remotes.
   */
  getAllRemotes(): Record<string, string> {
    return this.remotes;
  }

  /**
   * Resolves the final URL for a given script ID.
   */
  getRemoteUrl(scriptId: string): string | null {
    const remoteUrl = this.remotes[scriptId];
    if (!remoteUrl) return null;

    return remoteUrl.replace('[name]', scriptId);
  }

  /**
   * Returns headers for bundle requests.
   * Guaranteed to return Record<string, string> to satisfy Re.Pack types.
   */
  getHeaders(): Record<string, string> {
    if (!this.authToken) return {};
    
    return {
      'Authorization': `Bearer ${this.authToken}`
    };
  }
}

export const RemoteConfig = new RemoteConfigService();
