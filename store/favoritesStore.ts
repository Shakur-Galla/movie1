// store/favoritesStore.ts
import { create } from 'zustand';
import { Movie } from '../api/types';
import { StorageService } from '../utility/storage';

interface FavoritesState {
  favorites: Movie[];
  loading: boolean;
  initialized: boolean;
  
  // Actions
  loadFavorites: () => Promise<void>;
  addFavorite: (movie: Movie) => Promise<boolean>;
  removeFavorite: (movieId: number) => Promise<boolean>;
  isFavorite: (movieId: number) => boolean;
  clearAllFavorites: () => Promise<boolean>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,
  initialized: false,

  loadFavorites: async () => {
    set({ loading: true });
    
    try {
      const favorites = await StorageService.getFavorites();
      set({ favorites, loading: false, initialized: true });
    } catch (error) {
      console.error('Error loading favorites:', error);
      set({ loading: false, initialized: true });
    }
  },

  addFavorite: async (movie: Movie) => {
    const { favorites } = get();
    
    // Check if already exists
    const exists = favorites.some((fav) => fav.id === movie.id);
    if (exists) return true;

    // Optimistic update
    const updatedFavorites = [movie, ...favorites];
    set({ favorites: updatedFavorites });

    // Save to storage
    const success = await StorageService.addFavorite(movie);
    
    if (!success) {
      // Rollback on failure
      set({ favorites });
      return false;
    }

    return true;
  },

  removeFavorite: async (movieId: number) => {
    const { favorites } = get();
    
    // Optimistic update
    const updatedFavorites = favorites.filter((fav) => fav.id !== movieId);
    set({ favorites: updatedFavorites });

    // Save to storage
    const success = await StorageService.removeFavorite(movieId);
    
    if (!success) {
      // Rollback on failure
      set({ favorites });
      return false;
    }

    return true;
  },

  isFavorite: (movieId: number) => {
    const { favorites } = get();
    return favorites.some((fav) => fav.id === movieId);
  },

  clearAllFavorites: async () => {
    const { favorites } = get();
    
    // Optimistic update
    set({ favorites: [] });

    // Clear from storage
    const success = await StorageService.clearFavorites();
    
    if (!success) {
      // Rollback on failure
      set({ favorites });
      return false;
    }

    return true;
  },
}));