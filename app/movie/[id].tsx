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
import MovieService from '../../api/endpoints';
import { useMovieDetailStore } from '../../store/movieDetailStore';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { movie, cast, loading, error, fetchMovieDetails, reset } =
    useMovieDetailStore();

  useEffect(() => {
    if (id) fetchMovieDetails(parseInt(id));
    return () => reset();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#F7F7F5] justify-center items-center">
        <ActivityIndicator size="large" color="#C9A24D" />
        <Text className="text-gray-400 mt-4">
          Loading movie details…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#F7F7F5] justify-center items-center px-6">
        <Ionicons name="alert-circle-outline" size={56} color="#EF4444" />
        <Text className="text-lg font-semibold text-gray-900 mt-4">
          Something went wrong
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-2">
          {error}
        </Text>

        <TouchableOpacity
          onPress={() => id && fetchMovieDetails(parseInt(id))}
          className="bg-gray-900 px-6 
          py-3 rounded-xl mt-6"
        >
          <Text className="text-white font-medium">
            Retry
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-gray-500">
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) return null;

  const posterUrl = MovieService.getPosterUrl(movie.poster_path);
  const backdropUrl = MovieService.getBackdropUrl(movie.backdrop_path);

  return (
    <View className="flex-1 bg-[#F7F7F5]">
      {/* Floating Back Button */}
      <View className="absolute top-0 left-0 right-0 z-10 pt-12 px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          className="bg-black/40 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Backdrop */}
        {backdropUrl ? (
          <Image
            source={{ uri: backdropUrl }}
            className="w-full h-64"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-64 bg-gray-200 justify-center items-center">
            <Ionicons name="film-outline" size={56} color="#9CA3AF" />
          </View>
        )}

        <View className="px-5 py-5">
          {/* Title + Rating */}
          <View className="flex-row items-start justify-between mb-3">
            <Text className="text-3xl font-bold text-gray-900 flex-1 pr-4">
              {movie.title}
            </Text>

            <View className="bg-[#C9A24D]/15 px-3 py-1.5 rounded-full">
              <Text className="text-sm font-semibold text-[#C9A24D]">
                ★ {movie.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Tagline */}
          {movie.tagline && (
            <Text className="text-gray-500 italic text-base mb-4">
              “{movie.tagline}”
            </Text>
          )}

          {/* Meta Info */}
          <View className="flex-row flex-wrap gap-2 mb-5">
            <View className="bg-white border border-gray-200 px-3 py-1 rounded-full">
              <Text className="text-gray-600 text-sm">
                {movie.release_date}
              </Text>
            </View>

            {movie.runtime > 0 && (
              <View className="bg-white border border-gray-200 px-3 py-1 rounded-full">
                <Text className="text-gray-600 text-sm">
                  {movie.runtime} min
                </Text>
              </View>
            )}

            <View className="bg-white border border-gray-200 px-3 py-1 rounded-full">
              <Text className="text-gray-600 text-sm">
                {movie.status}
              </Text>
            </View>
          </View>

          {/* Genres */}
          {movie.genres.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <View
                  key={genre.id}
                  className="bg-gray-900/5 px-3 py-1 rounded-full"
                >
                  <Text className="text-gray-700 text-sm font-medium">
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Primary Action */}
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-gray-900 py-4 rounded-2xl items-center mb-6"
          >
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={22} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Add to Favorites
              </Text>
            </View>
          </TouchableOpacity>

          {/* Overview */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Overview
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              {movie.overview || 'No overview available.'}
            </Text>
          </View>

          {/* Cast */}
          {cast.length > 0 && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Cast
              </Text>

              {cast.map((actor) => (
                <View
                  key={actor.id}
                  className="
                    flex-row items-center
                    bg-white
                    border border-gray-100
                    rounded-2xl
                    px-4 py-3
                    mb-3
                  "
                >
                  {actor.profile_path ? (
                    <Image
                      source={{
                        uri: MovieService.getProfileUrl(actor.profile_path),
                      }}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
                      <Ionicons name="person" size={22} color="#9CA3AF" />
                    </View>
                  )}

                  <View className="flex-1 ml-3">
                    <Text className="text-gray-900 font-semibold text-base">
                      {actor.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {actor.character}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Box Office */}
          {(movie.budget > 0 || movie.revenue > 0) && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-900 mb-3">
                Box Office
              </Text>

              {movie.budget > 0 && (
                <View className="flex-row justify-between py-3 border-b border-gray-200">
                  <Text className="text-gray-500">Budget</Text>
                  <Text className="text-gray-900 font-semibold">
                    ${(movie.budget / 1_000_000).toFixed(1)}M
                  </Text>
                </View>
              )}

              {movie.revenue > 0 && (
                <View className="flex-row justify-between py-3">
                  <Text className="text-gray-500">Revenue</Text>
                  <Text className="text-gray-900 font-semibold">
                    ${(movie.revenue / 1_000_000).toFixed(1)}M
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Vote Count */}
          <Text className="text-center text-gray-400 text-sm mb-6">
            Based on {movie.vote_count.toLocaleString()} votes
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
