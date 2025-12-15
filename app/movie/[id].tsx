// app/movie/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useMovieDetailStore } from '../..//store/movieDetailStore';
import MovieService from '../../api/endpoints';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { movie, cast, loading, error, fetchMovieDetails, reset } = useMovieDetailStore();

  useEffect(() => {
    if (id) {
      fetchMovieDetails(parseInt(id));
    }

    return () => {
      reset();
    };
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="text-gray-500 mt-4">Loading movie details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-4">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-red-600 font-semibold text-lg mt-4">Error</Text>
        <Text className="text-gray-600 text-center mt-2">{error}</Text>
        <TouchableOpacity
          onPress={() => id && fetchMovieDetails(parseInt(id))}
          className="bg-blue-500 px-6 py-3 rounded-lg mt-4"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4"
        >
          <Text className="text-blue-500">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) {
    return null;
  }

  const posterUrl = MovieService.getPosterUrl(movie.poster_path);
  const backdropUrl = MovieService.getBackdropUrl(movie.backdrop_path);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 pt-12 px-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black/50 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Backdrop Image */}
        {backdropUrl ? (
          <Image
            source={{ uri: backdropUrl }}
            className="w-full h-64"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-64 bg-gray-200 justify-center items-center">
            <Ionicons name="film-outline" size={64} color="#9CA3AF" />
          </View>
        )}

        <View className="px-4 py-4">
          {/* Title and Rating */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-3xl font-bold text-gray-900 flex-1 pr-4">
              {movie.title}
            </Text>
            <View className="bg-yellow-400 px-3 py-2 rounded-lg">
              <Text className="text-lg font-bold">⭐ {movie.vote_average.toFixed(1)}</Text>
            </View>
          </View>

          {/* Tagline */}
          {movie.tagline && (
            <Text className="text-gray-600 italic text-base mb-3">
              "{movie.tagline}"
            </Text>
          )}

          {/* Info Row */}
          <View className="flex-row flex-wrap gap-3 mb-4">
            <View className="bg-gray-100 px-3 py-1 rounded">
              <Text className="text-gray-700 text-sm">{movie.release_date}</Text>
            </View>
            {movie.runtime > 0 && (
              <View className="bg-gray-100 px-3 py-1 rounded">
                <Text className="text-gray-700 text-sm">{movie.runtime} min</Text>
              </View>
            )}
            <View className="bg-gray-100 px-3 py-1 rounded">
              <Text className="text-gray-700 text-sm">{movie.status}</Text>
            </View>
          </View>

          {/* Genres */}
          {movie.genres.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <View key={genre.id} className="bg-blue-100 px-3 py-1 rounded-full">
                  <Text className="text-blue-700 text-sm font-medium">{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Add to Favorites Button */}
          <TouchableOpacity
            className="bg-red-500 py-4 rounded-lg items-center mb-4"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Add to Favorites
              </Text>
            </View>
          </TouchableOpacity>

          {/* Overview */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-2">Overview</Text>
            <Text className="text-gray-700 text-base leading-6">
              {movie.overview || 'No overview available.'}
            </Text>
          </View>

          {/* Cast */}
          {cast.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-900 mb-3">Cast</Text>
              {cast.map((actor) => (
                <View
                  key={actor.id}
                  className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-2"
                >
                  {actor.profile_path ? (
                    <Image
                      source={{ uri: MovieService.getProfileUrl(actor.profile_path) }}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
                      <Ionicons name="person" size={24} color="#9CA3AF" />
                    </View>
                  )}
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-900 font-semibold text-base">
                      {actor.name}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {actor.character}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Additional Info */}
          {(movie.budget > 0 || movie.revenue > 0) && (
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-900 mb-3">Box Office</Text>
              {movie.budget > 0 && (
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600">Budget</Text>
                  <Text className="text-gray-900 font-semibold">
                    ${(movie.budget / 1000000).toFixed(1)}M
                  </Text>
                </View>
              )}
              {movie.revenue > 0 && (
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-600">Revenue</Text>
                  <Text className="text-gray-900 font-semibold">
                    ${(movie.revenue / 1000000).toFixed(1)}M
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Vote Count */}
          <View className="mb-6">
            <Text className="text-gray-600 text-sm text-center">
              Based on {movie.vote_count.toLocaleString()} votes
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}