// app/(tabs)/index.tsx
import React from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="pt-16 pb-4 px-5 border-b border-gray-200">
        <Text className="text-3xl font-bold">Movies</Text>
        <Text className="text-gray-500 mt-1">Discover trending films</Text>
      </View>
      
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-400">
          Home Screen - Coming Soon
        </Text>
      </View>
    </View>
  );
}