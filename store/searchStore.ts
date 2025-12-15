//store/searchStore.ts
import { create } from 'zustand';
import MovieService from '../api/endpoints';
import { Movie } from '../api/types';

interface SearchState {
  query: string;
  movies: Movie[];
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  hasSearched: boolean;
  
  // Actions
  setQuery: (query: string) => void;
  searchMovies: (query: string, page?: number) => Promise<void>;
  loadMoreResults: () => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  movies: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  hasMore: true,
  hasSearched: false,

  setQuery: (query: string) => {
    set({ query });
  },

  searchMovies: async (query: string, page = 1) => {
    const trimmedQuery = query.trim();
    
    // If query is empty, clear results
    if (!trimmedQuery) {
      set({
        movies: [],
        page: 1,
        totalPages: 1,
        hasMore: false,
        hasSearched: false,
        error: null,
      });
      return;
    }

    set({ loading: true, error: null });

    const response = await MovieService.searchMovies(trimmedQuery, page);

    if (response.success) {
      set({
        movies: page === 1 ? response.data.results : [...get().movies, ...response.data.results],
        page: response.data.page,
        totalPages: response.data.total_pages,
        hasMore: response.data.page < response.data.total_pages,
        loading: false,
        hasSearched: true,
      });
    } else {
      set({
        error: response.error,
        loading: false,
        hasSearched: true,
      });
    }
  },

  loadMoreResults: async () => {
    const { loading, page, totalPages, hasMore, query } = get();
    
    if (loading || !hasMore || !query.trim()) return;

    const nextPage = page + 1;
    if (nextPage > totalPages) {
      set({ hasMore: false });
      return;
    }

    await get().searchMovies(query, nextPage);
  },

  clearSearch: () => {
    set({
      query: '',
      movies: [],
      page: 1,
      totalPages: 1,
      loading: false,
      error: null,
      hasMore: true,
      hasSearched: false,
    });
  },
}));