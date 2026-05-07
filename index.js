import { AppRegistry, Platform } from 'react-native';
import { ScriptManager } from '@callstack/repack/client';
import App from './App';
import { name as appName } from './app.json';
import { RemoteConfig } from './src/services/RemoteConfig';

// ESAD Dynamic Resolver
// Automatically resolves bundles using URLs and Tokens from RemoteConfig.
ScriptManager.shared.addResolver(async (scriptId, caller) => {
  const url = RemoteConfig.getRemoteUrl(scriptId);

  if (url) {
    return {
      url,
      query: {
        platform: Platform.OS,
      },
      headers: RemoteConfig.getHeaders(),
    };
  }

  return undefined;
});

AppRegistry.registerComponent(appName, () => App);
