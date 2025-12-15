// store/movieDetailStore.ts
import { create } from 'zustand';
import MovieService from '../api/endpoints';
import { Cast, MovieDetail } from '../api/types';

interface MovieDetailState {
  movie: MovieDetail | null;
  cast: Cast[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchMovieDetails: (movieId: number) => Promise<void>;
  reset: () => void;
}

export const useMovieDetailStore = create<MovieDetailState>((set) => ({
  movie: null,
  cast: [],
  loading: false,
  error: null,

  fetchMovieDetails: async (movieId: number) => {
    set({ loading: true, error: null, movie: null, cast: [] });

    try {
      // Fetch both movie details and credits in parallel
      const [detailsResponse, creditsResponse] = await Promise.all([
        MovieService.getMovieDetails(movieId),
        MovieService.getMovieCredits(movieId),
      ]);

      if (detailsResponse.success && creditsResponse.success) {
        set({
          movie: detailsResponse.data,
          cast: creditsResponse.data.cast.slice(0, 10), // Top 10 cast members
          loading: false,
          error: null,
        });
      } else {
        // Handle error from either response
        let errorMessage = 'Failed to load movie details';
        
        if (!detailsResponse.success) {
          errorMessage = detailsResponse.error;
        } else if (!creditsResponse.success) {
          errorMessage = creditsResponse.error;
        }
        
        set({
          error: errorMessage,
          loading: false,
          movie: null,
          cast: [],
        });
      }
    } catch (err) {
      console.error('Movie details error:', err);
      set({
        error: 'An unexpected error occurred',
        loading: false,
        movie: null,
        cast: [],
      });
    }
  },

  reset: () => {
    set({
      movie: null,
      cast: [],
      loading: false,
      error: null,
    });
  },
}));