// utility/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../api/types';

const FAVORITES_KEY = '@movie_favorites';

export const StorageService = {
  /**
   * Get all favorite movies from storage
   */
  async getFavorites(): Promise<Movie[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  /**
   * Save favorites to storage
   */
  async saveFavorites(favorites: Movie[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error saving favorites:', error);
      return false;
    }
  },

  /**
   * Add a movie to favorites
   */
  async addFavorite(movie: Movie): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const exists = favorites.some((fav) => fav.id === movie.id);
      
      if (!exists) {
        const updatedFavorites = [movie, ...favorites];
        return await this.saveFavorites(updatedFavorites);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  },

  /**
   * Remove a movie from favorites
   */
  async removeFavorite(movieId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter((fav) => fav.id !== movieId);
      return await this.saveFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  },

  /**
   * Check if a movie is in favorites
   */
  async isFavorite(movieId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some((fav) => fav.id === movieId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  /**
   * Clear all favorites
   */
  async clearFavorites(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  },
};