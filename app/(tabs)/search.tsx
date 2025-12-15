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
import { Movie } from '../../api/types';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearchStore } from '../../store/searchStore';

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
          <Text className="text-sm font-semibold text-[#C9A24D]">
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
        <View className="items-center py-28">
          <ActivityIndicator size="large" color="#C9A24D" />
          <Text className="text-sm text-gray-400 mt-4">
            Searching…
          </Text>
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
            onPress={() => searchMovies(query)}
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

    if (hasSearched && movies.length === 0) {
      return (
        <View className="items-center py-24 px-6">
          <Ionicons name="search-outline" size={56} color="#D1D5DB" />
          <Text className="text-gray-600 text-base mt-4 font-medium">
            No results found
          </Text>
          <Text className="text-gray-400 text-sm text-center mt-2">
            Try a different movie title
          </Text>
        </View>
      );
    }

    return (
      <View className="items-center py-24 px-6">
        <Ionicons name="film-outline" size={56} color="#D1D5DB" />
        <Text className="text-gray-600 text-base mt-4 font-medium">
          Search for movies
        </Text>
        <Text className="text-gray-400 text-sm text-center mt-2">
          Enter a title to get started
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
      loadMoreResults();
    }
  };

  return (
    <View className="flex-1 bg-[#F7F7F5]">
      {/* Aadily-style search header */}
      <View className="pt-14 pb-6 px-5 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
          Search
        </Text>

        <View className="
          flex-row items-center
          bg-[#F2F2F0]
          rounded-2xl
          px-4 py-3
          border border-gray-200
        ">
          <Ionicons name="search" size={20} color="#9CA3AF" />

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search movies..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
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
          <Text className="text-sm text-gray-500 mt-3">
            Found {movies.length} result{movies.length !== 1 ? 's' : ''}
          </Text>
        )}
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
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
