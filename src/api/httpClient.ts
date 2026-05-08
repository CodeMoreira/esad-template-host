import axios from 'axios';
import { Platform } from 'react-native';

const httpClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to replace localhost with 10.0.2.2 for Android emulators
httpClient.interceptors.request.use((config) => {
  if (Platform.OS === 'android' && config.url) {
    if (config.url.includes('localhost')) {
      config.url = config.url.replace('localhost', '10.0.2.2');
    } else if (config.url.includes('127.0.0.1')) {
      config.url = config.url.replace('127.0.0.1', '10.0.2.2');
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default httpClient;
