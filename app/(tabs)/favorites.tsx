// app/(tabs)/favorites.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Movie } from '../../api/types';
import { useFavoritesStore } from '../../store/favoritesStore';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, loading, initialized, loadFavorites, removeFavorite, clearAllFavorites } =
    useFavoritesStore();

  useEffect(() => {
    if (!initialized) {
      loadFavorites();
    }
  }, []);

  const handleRemoveFavorite = (movieId: number, movieTitle: string) => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${movieTitle}" from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeFavorite(movieId);
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (favorites.length === 0) return;

    Alert.alert(
      'Clear All Favorites',
      `Remove all ${favorites.length} movies from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAllFavorites();
          },
        },
      ]
    );
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

        <View className="flex-row items-center gap-2">
          <View className="bg-[#C9A24D]/15 px-3 py-1.5 rounded-full">
            <Text className="text-sm font-semibold text-[#C9A24D]">
              ★ {item.vote_average.toFixed(1)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleRemoveFavorite(item.id, item.title)}
            className="w-8 h-8 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="heart" size={22} color="#EF4444" />
          </TouchableOpacity>
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
    if (loading) {
      return (
        <View className="items-center py-28">
          <ActivityIndicator size="large" color="#C9A24D" />
          <Text className="text-sm text-gray-400 mt-4">
            Loading favorites…
          </Text>
        </View>
      );
    }

    return (
      <View className="items-center py-28 px-6">
        <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
        <Text className="text-gray-900 font-semibold text-lg mt-4">
          No favorites yet
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Movies you favorite will appear here
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#F7F7F5]">
      <View className="pt-14 pb-6 px-5 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900 tracking-tight">
              Favorites
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {favorites.length} movie{favorites.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {favorites.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              className="bg-red-50 px-4 py-2 rounded-xl"
              activeOpacity={0.85}
            >
              <Text className="text-red-600 font-medium text-sm">
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}