// app/(tabs)/index.tsx
import { MovieCardSkeleton } from '@/components/Skeleton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MovieService from '../../api/endpoints';
import { Movie } from '../../api/types';
import { useMoviesStore } from '../../store/moviesStore';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = (width - 60) / 3;

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

  const [selectedCategory, setSelectedCategory] = useState('Popular');

  useEffect(() => {
    fetchMovies();
  }, []);

  // Get featured movie (highest rated from first 5)
  const featuredMovie = movies.length > 0 
    ? movies.slice(0, 5).reduce((prev, current) => 
        (prev.vote_average > current.vote_average) ? prev : current
      )
    : null;

  // Get movies for trending (first 6 movies)
  const trendingMovies = movies.slice(0, 6);
  
  // Get IDs of movies already shown in featured/trending
  const shownMovieIds = new Set([
    ...(featuredMovie ? [featuredMovie.id] : []),
    ...trendingMovies.map(m => m.id)
  ]);
  
  // Get movies for main list (exclude already shown movies)
  const mainListMovies = movies.filter(movie => !shownMovieIds.has(movie.id));

  // Categories
  const categories = ['Popular', 'Trending', 'Top Rated', 'Upcoming'];

  const renderFeaturedHero = () => {
    if (!featuredMovie) return null;

    const backdropUrl = MovieService.getBackdropUrl(featuredMovie.backdrop_path);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push(`/movie/${featuredMovie.id}`)}
        className="mx-4 mb-6 rounded-3xl overflow-hidden bg-gray-900"
      >
        {backdropUrl ? (
          <Image
            source={{ uri: backdropUrl }}
            className="w-full h-56"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-56 bg-gray-800 justify-center items-center">
            <Ionicons name="film-outline" size={64} color="#4B5563" />
          </View>
        )}
        
        {/* Gradient Overlay */}
        <View className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Featured Badge */}
        <View className="absolute top-4 left-4 bg-red-600 px-3 py-1.5 rounded-full flex-row items-center">
          <Ionicons name="star" size={14} color="white" />
          <Text className="text-white font-bold text-xs ml-1">FEATURED</Text>
        </View>

        {/* Content */}
        <View className="absolute bottom-0 left-0 right-0 p-5">
          <Text 
            numberOfLines={2} 
            className="text-white text-2xl font-bold mb-2 tracking-tight"
          >
            {featuredMovie.title}
          </Text>
          
          <View className="flex-row items-center mb-3">
            <View className="bg-yellow-500/20 px-2 py-1 rounded-md mr-2">
              <Text className="text-yellow-400 font-bold text-sm">
                ★ {featuredMovie.vote_average.toFixed(1)}
              </Text>
            </View>
            <Text className="text-gray-300 text-xs">
              {featuredMovie.release_date?.split('-')[0] || 'N/A'}
            </Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity 
              className="bg-white px-6 py-2.5 rounded-full flex-row items-center mr-3"
              onPress={() => router.push(`/movie/${featuredMovie.id}`)}
            >
              <Ionicons name="play" size={18} color="#000" />
              <Text className="text-black font-bold ml-1.5">Watch Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-white/20 p-2.5 rounded-full">
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => setSelectedCategory(category)}
          className={`px-5 py-2.5 rounded-full mr-3 ${
            selectedCategory === category
              ? 'bg-gray-900'
              : 'bg-white border border-gray-200'
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              selectedCategory === category ? 'text-white' : 'text-gray-600'
            }`}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTrendingRow = () => {
    if (trendingMovies.length === 0) return null;
    
    return (
      <View className="mb-6">
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Text className="text-xl font-bold text-gray-900">Trending Now</Text>
          <TouchableOpacity>
            <Text className="text-gray-500 text-sm">See all</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {trendingMovies.map((movie, index) => (
            <TouchableOpacity
              key={`trending-${movie.id}`}
              activeOpacity={0.85}
              onPress={() => router.push(`/movie/${movie.id}`)}
              className="mr-3"
              style={{ width: POSTER_WIDTH }}
            >
              {MovieService.getPosterUrl(movie.poster_path) ? (
                <Image
                  source={{ uri: MovieService.getPosterUrl(movie.poster_path) }}
                  className="w-full rounded-2xl bg-gray-200"
                  style={{ height: POSTER_WIDTH * 1.5 }}
                  resizeMode="cover"
                />
              ) : (
                <View 
                  className="w-full rounded-2xl bg-gray-200 justify-center items-center"
                  style={{ height: POSTER_WIDTH * 1.5 }}
                >
                  <Ionicons name="film-outline" size={40} color="#9CA3AF" />
                </View>
              )}
              
              {/* Ranking Badge */}
              <View className="absolute top-2 left-2 bg-black/70 w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-sm">{index + 1}</Text>
              </View>

              {/* Rating */}
              <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-lg">
                <Text className="text-white text-xs font-semibold">
                  ★ {movie.vote_average.toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/movie/${item.id}`)}
      className="bg-white mx-4 mb-4 rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
    >
      {/* Movie Poster Thumbnail */}
      <View className="flex-row">
        {MovieService.getPosterUrl(item.poster_path) ? (
          <Image
            source={{ uri: MovieService.getPosterUrl(item.poster_path) }}
            className="w-24 h-36 bg-gray-200"
            resizeMode="cover"
          />
        ) : (
          <View className="w-24 h-36 bg-gray-200 justify-center items-center">
            <Ionicons name="film-outline" size={32} color="#9CA3AF" />
          </View>
        )}

        <View className="flex-1 p-4">
          <View className="flex-row items-start justify-between mb-1">
            <Text
              numberOfLines={2}
              className="text-[17px] font-semibold text-gray-900 leading-snug flex-1 pr-2"
            >
              {item.title}
            </Text>

            <View className="bg-yellow-500/15 px-2.5 py-1 rounded-lg">
              <Text className="text-sm font-bold text-yellow-600">
                ★ {item.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>

          <Text className="text-xs text-gray-400 mb-2 tracking-wide">
            {item.release_date || 'Release date unavailable'}
          </Text>

          {item.overview && (
            <Text
              numberOfLines={2}
              className="text-sm text-gray-600 leading-relaxed mb-3"
            >
              {item.overview}
            </Text>
          )}

          {/* Action Buttons */}
          <View className="flex-row items-center">
            <TouchableOpacity className="bg-gray-900 px-4 py-2 rounded-full flex-row items-center mr-2">
              <Ionicons name="play" size={14} color="white" />
              <Text className="text-white text-xs font-semibold ml-1">Watch</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
              <Ionicons name="add-outline" size={16} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (loading && movies.length === 0) {
      return (
        <View>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MovieCardSkeleton key={`skeleton-${i}`} />
          ))}
        </View>
      );
    }

    if (error) {
      return (
        <View className="items-center py-24 px-6">
          <View className="bg-red-100 w-20 h-20 rounded-full items-center justify-center mb-4">
            <Ionicons name="alert-circle" size={40} color="#EF4444" />
          </View>
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
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="items-center py-24">
        <Ionicons name="film-outline" size={64} color="#D1D5DB" />
        <Text className="text-sm text-gray-400 mt-4">No movies available</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || movies.length === 0) return null;

    return (
      <View className="py-6">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  };

  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchMoreMovies();
    }
  };

  const renderHeader = () => (
    <View>
      {/* App Bar */}
      <View className="pt-14 pb-4 px-5 bg-white">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900 tracking-tight">
              Watch
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">
              Stream unlimited movies
            </Text>
          </View>
          
          <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Hero */}
      <View className="pt-4 pb-2">
        {renderFeaturedHero()}
      </View>

      {/* Category Tabs */}
      {renderCategoryTabs()}

      {/* Trending Row */}
      {renderTrendingRow()}

      {/* Section Header */}
      <View className="px-4 mb-3 mt-2">
        <Text className="text-xl font-bold text-gray-900">All Movies</Text>
        <Text className="text-sm text-gray-500 mt-0.5">
          {movies.length} movies available
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F7F7F5]">
      <FlatList
        data={mainListMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => `main-${item.id}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.6}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshMovies}
            colors={['#000000']}
            tintColor="#000000"
            progressBackgroundColor="#FFFFFF"
          />
        }
      />
    </View>
  );
}