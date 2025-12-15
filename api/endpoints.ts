// src/api/endpoints.ts
import apiClient from './client';
import {
    ApiResponse,
    Credits,
    MovieDetail,
    MovieListResponse
} from './types';

class MovieService {
  /**
   * Fetch popular movies with pagination
   */
  async getPopularMovies(page: number = 1): Promise<ApiResponse<MovieListResponse>> {
    try {
      const data = await apiClient.get<MovieListResponse>('/movie/popular', {
        page,
      });
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as string,
      };
    }
  }

  /**
   * Search movies by query
   */
  async searchMovies(
    query: string,
    page: number = 1
  ): Promise<ApiResponse<MovieListResponse>> {
    try {
      if (!query.trim()) {
        return {
          success: true,
          data: {
            page: 1,
            results: [],
            total_pages: 0,
            total_results: 0,
          },
        };
      }

      const data = await apiClient.get<MovieListResponse>('/search/movie', {
        query: query.trim(),
        page,
      });
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as string,
      };
    }
  }

  /**
   * Get movie details by ID
   */
  async getMovieDetails(movieId: number): Promise<ApiResponse<MovieDetail>> {
    try {
      const data = await apiClient.get<MovieDetail>(`/movie/${movieId}`);
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as string,
      };
    }
  }

  /**
   * Get movie credits (cast and crew)
   */
  async getMovieCredits(movieId: number): Promise<ApiResponse<Credits>> {
    try {
      const data = await apiClient.get<Credits>(`/movie/${movieId}/credits`);
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as string,
      };
    }
  }

  /**
   * Get movie poster URL
   */
  getPosterUrl(posterPath: string | null): string {
    return apiClient.getPosterUrl(posterPath);
  }

  /**
   * Get movie backdrop URL
   */
  getBackdropUrl(backdropPath: string | null): string {
    return apiClient.getBackdropUrl(backdropPath);
  }

  /**
   * Get cast profile image URL
   */
  getProfileUrl(profilePath: string | null): string {
    return apiClient.getImageUrl(profilePath, 'w500');
  }
}

export default new MovieService();