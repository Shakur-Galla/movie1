// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MovieService from '../../api/endpoints';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState('');

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setMovies([]);
    
    const response = await MovieService.getPopularMovies(1);
    
    if (response.success) {
      setMovies(response.data.results.slice(0, 5));
    } else {
      setError(response.error);
    }
    
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-16 pb-4 px-5 border-b border-gray-200">
        <Text className="text-3xl font-bold">Movies</Text>
        <Text className="text-gray-500 mt-1">API Connection Test</Text>
      </View>
      
      <View className="flex-1 p-5">
        <TouchableOpacity
          onPress={testAPI}
          disabled={loading}
          className={`p-4 rounded-lg items-center mb-4 ${
            loading ? 'bg-gray-300' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white text-base font-semibold">
            {loading ? 'Loading...' : 'Test API Connection'}
          </Text>
        </TouchableOpacity>

        {loading && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}

        {error && (
          <View className="bg-red-50 p-4 rounded-lg">
            <Text className="text-red-600 font-semibold">Error:</Text>
            <Text className="text-red-500 mt-1">{error}</Text>
          </View>
        )}

        {movies.length > 0 && (
          <ScrollView className="flex-1">
            <View className="bg-green-50 p-4 rounded-lg mb-4">
              <Text className="text-green-600 font-semibold"> API Connected!</Text>
              <Text className="text-green-500 mt-1">Found {movies.length} movies</Text>
            </View>

            {movies.map((movie, index) => (
              <View key={movie.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                <Text className="font-bold text-lg">{index + 1}. {movie.title}</Text>
                <Text className="text-gray-600 mt-1">⭐ {movie.vote_average}/10</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Released: {movie.release_date}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}