// app/(tabs)/search.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDebounce } from '../..//hooks/useDebounce';
import { useSearchStore } from '../..//store/searchStore';
import { Movie } from '../../api/types';

export default function SearchScreen() {
  const router = useRouter();
  const {
    query,
    movies,
    loading,
    error,
    hasMore,
    hasSearched,
    setQuery,
    searchMovies,
    loadMoreResults,
    clearSearch,
  } = useSearchStore();

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchMovies(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleClearSearch = () => {
    clearSearch();
    Keyboard.dismiss();
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      className="bg-white border border-gray-200 rounded-lg p-4 mb-3 mx-4"
      activeOpacity={0.7}
      onPress={() => router.push(`/movie/${item.id}`)}
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
          <Text className="text-gray-500 mt-4">Searching...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center py-20 px-4">
          <Text className="text-red-600 font-semibold text-lg mb-2">Error</Text>
          <Text className="text-gray-600 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => searchMovies(query)}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (hasSearched && movies.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-20 px-4">
          <Ionicons name="search-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 text-lg mt-4">No movies found</Text>
          <Text className="text-gray-400 text-center mt-2">
            Try searching for something else
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center py-20 px-4">
        <Ionicons name="film-outline" size={64} color="#D1D5DB" />
        <Text className="text-gray-500 text-lg mt-4">Search for movies</Text>
        <Text className="text-gray-400 text-center mt-2">
          Enter a movie title to get started
        </Text>
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
      loadMoreResults();
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-16 pb-4 px-4 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900 mb-4">Search</Text>
        
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search movies..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-base text-gray-900"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} className="ml-2">
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {hasSearched && movies.length > 0 && (
          <Text className="text-gray-500 mt-2">
            Found {movies.length} result{movies.length !== 1 ? 's' : ''}
          </Text>
        )}
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
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}