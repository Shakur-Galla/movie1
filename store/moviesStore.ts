// store/moviesStore.ts
import { create } from 'zustand';
import MovieService from '../api/endpoints';
import { Movie } from '../api/types';

interface MoviesState {
  movies: Movie[];
  page: number;
  totalPages: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  
  // Actions
  fetchMovies: () => Promise<void>;
  fetchMoreMovies: () => Promise<void>;
  refreshMovies: () => Promise<void>;
  reset: () => void;
}

export const useMoviesStore = create<MoviesState>((set, get) => ({
  movies: [],
  page: 1,
  totalPages: 1,
  loading: false,
  refreshing: false,
  error: null,
  hasMore: true,

  fetchMovies: async () => {
    const { loading, refreshing } = get();
    if (loading || refreshing) return;

    set({ loading: true, error: null });

    const response = await MovieService.getPopularMovies(1);

    if (response.success) {
      set({
        movies: response.data.results,
        page: 1,
        totalPages: response.data.total_pages,
        hasMore: response.data.page < response.data.total_pages,
        loading: false,
      });
    } else {
      set({
        error: response.error,
        loading: false,
      });
    }
  },

  fetchMoreMovies: async () => {
    const { loading, refreshing, page, totalPages, hasMore } = get();
    
    if (loading || refreshing || !hasMore) return;

    const nextPage = page + 1;
    if (nextPage > totalPages) {
      set({ hasMore: false });
      return;
    }

    set({ loading: true, error: null });

    const response = await MovieService.getPopularMovies(nextPage);

    if (response.success) {
      set((state) => ({
        movies: [...state.movies, ...response.data.results],
        page: nextPage,
        hasMore: nextPage < response.data.total_pages,
        loading: false,
      }));
    } else {
      set({
        error: response.error,
        loading: false,
      });
    }
  },

  refreshMovies: async () => {
    const { refreshing, loading } = get();
    if (refreshing || loading) return;

    set({ refreshing: true, error: null });

    const response = await MovieService.getPopularMovies(1);

    if (response.success) {
      set({
        movies: response.data.results,
        page: 1,
        totalPages: response.data.total_pages,
        hasMore: response.data.page < response.data.total_pages,
        refreshing: false,
      });
    } else {
      set({
        error: response.error,
        refreshing: false,
      });
    }
  },

  reset: () => {
    set({
      movies: [],
      page: 1,
      totalPages: 1,
      loading: false,
      refreshing: false,
      error: null,
      hasMore: true,
    });
  },
}));