// app/(tabs)/index.tsx
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMoviesStore } from '../..//store/moviesStore';
import { Movie } from '../../api/types';

export default function HomeScreen() {
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
      className="bg-white border border-gray-200 rounded-lg p-4 mb-3 mx-4"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-gray-900" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {item.release_date || 'N/A'}
          </Text>
        </View>
        <View className="bg-yellow-400 px-2 py-1 rounded">
          <Text className="text-sm font-bold">⭐ {item.vote_average.toFixed(1)}</Text>
        </View>
      </View>
      
      {item.overview && (
        <Text className="text-gray-600 text-sm mt-2" numberOfLines={3}>
          {item.overview}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (loading && movies.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="text-gray-500 mt-4">Loading movies...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center py-20 px-4">
          <Text className="text-red-600 font-semibold text-lg mb-2">Error</Text>
          <Text className="text-gray-600 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={fetchMovies}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className="text-gray-500">No movies found</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || movies.length === 0) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchMoreMovies();
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-16 pb-4 px-4 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900">Movies</Text>
        <Text className="text-gray-500 mt-1">
          Popular & Trending • {movies.length} movies
        </Text>
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshMovies}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
}