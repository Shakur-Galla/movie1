// src/api/client.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import Constants from 'expo-constants';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class ApiClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    // Get API key from expo-constants
    this.apiKey = Constants.expoConfig?.extra?.tmdbApiKey || '';
    
    if (!this.apiKey) {
      console.warn(' TMDB API key not found. Please add it to app.json');
    }
    
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        config.params = {
          ...config.params,
          api_key: this.apiKey,
        };
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      switch (status) {
        case 401:
          return 'Invalid API key. Please check your configuration.';
        case 404:
          return 'Resource not found.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
        case 502:
        case 503:
          return 'Server error. Please try again later.';
        default:
          return 'An error occurred. Please try again.';
      }
    } else if (error.request) {
      // Request made but no response
      return 'Network error. Please check your internet connection.';
    } else {
      // Something else happened
      return 'An unexpected error occurred.';
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  getImageUrl(path: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getPosterUrl(path: string | null): string {
    return this.getImageUrl(path, 'w500');
  }

  getBackdropUrl(path: string | null): string {
    return this.getImageUrl(path, 'w780');
  }
}

export default new ApiClient();