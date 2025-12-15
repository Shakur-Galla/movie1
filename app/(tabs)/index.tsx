// app/(tabs)/index.tsx
import { MovieCardSkeleton } from '@/components/Skeleton';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Movie } from '../../api/types';
import { useMoviesStore } from '../../store/moviesStore';

export default function HomeScreen() {
  const router = useRouter();
  const {
    movies,
    loading,
    refreshing,
    error,
    hasMore,
    fetchMovies,
    fetchMoreMovies,
    refreshMovies,
  } = useMoviesStore();

  useEffect(() => {
    fetchMovies();
  }, []);

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/movie/${item.id}`)}
      className="
        bg-white
        mx-4 mb-4
        px-5 py-4
        rounded-2xl
        border border-gray-100
        shadow-sm
      "
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text
            numberOfLines={2}
            className="text-[17px] font-semibold text-gray-900 leading-snug"
          >
            {item.title}
          </Text>

          <Text className="text-xs text-gray-400 mt-1 tracking-wide">
            {item.release_date || 'Release date unavailable'}
          </Text>
        </View>

        <View className="bg-[#C9A24D]/15 px-3 py-1.5 rounded-full">
          <Text className="text-sm font-semibold text-blue-500">
            ★ {item.vote_average.toFixed(1)}
          </Text>
        </View>
      </View>

      {item.overview && (
        <Text
          numberOfLines={3}
          className="text-sm text-gray-600 mt-3 leading-relaxed"
        >
          {item.overview}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (loading && movies.length === 0) {
      return (
        <View>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </View>
      );
    }

    if (error) {
      return (
        <View className="items-center py-24 px-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            {error}
          </Text>

          <TouchableOpacity
            onPress={fetchMovies}
            activeOpacity={0.85}
            className="bg-gray-900 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-medium">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="items-center py-24">
        <Text className="text-sm text-gray-400">
          No movies available
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || movies.length === 0) return null;

    return (
      <View className="py-6">
        <ActivityIndicator size="small" color="#C9A24D" />
      </View>
    );
  };

  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchMoreMovies();
    }
  };

  return (
    <View className="flex-1 bg-[#F7F7F5]">
      {/* Aadily-style Android header */}
      <View className="pt-14 pb-6 px-5 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900 tracking-tight">
          Movies
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Popular & Trending · {movies.length}
        </Text>
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshMovies}
            colors={['#C9A24D']}
            progressBackgroundColor="#FFFFFF"
          />
        }
      />
    </View>
  );
}