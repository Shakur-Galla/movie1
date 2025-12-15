// components/Skeleton.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
          opacity,
        },
        style,
      ]}
    />
  );
};

export const MovieCardSkeleton: React.FC = () => {
  return (
    <View className="bg-white mx-4 mb-4 px-5 py-4 rounded-2xl border border-gray-100">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 pr-4">
          <Skeleton width="80%" height={20} borderRadius={4} />
          <View className="mt-2">
            <Skeleton width="40%" height={12} borderRadius={4} />
          </View>
        </View>
        <Skeleton width={60} height={28} borderRadius={20} />
      </View>
      <Skeleton width="100%" height={50} borderRadius={6} />
    </View>
  );
};

export const MovieDetailSkeleton: React.FC = () => {
  return (
    <View className="flex-1 bg-[#F7F7F5]">
      {/* Backdrop skeleton */}
      <Skeleton width="100%" height={256} borderRadius={0} />
      
      <View className="px-5 py-5">
        {/* Title */}
        <View className="mb-4">
          <Skeleton width="90%" height={32} borderRadius={8} />
          <View className="mt-2">
            <Skeleton width="70%" height={24} borderRadius={8} />
          </View>
        </View>

        {/* Tagline */}
        <View className="mb-4">
          <Skeleton width="80%" height={16} borderRadius={4} />
        </View>

        {/* Meta info */}
        <View className="flex-row gap-2 mb-6">
          <Skeleton width={100} height={28} borderRadius={20} />
          <Skeleton width={80} height={28} borderRadius={20} />
          <Skeleton width={90} height={28} borderRadius={20} />
        </View>

        {/* Genres */}
        <View className="flex-row gap-2 mb-6">
          <Skeleton width={80} height={28} borderRadius={20} />
          <Skeleton width={90} height={28} borderRadius={20} />
          <Skeleton width={70} height={28} borderRadius={20} />
        </View>

        {/* Button */}
        <Skeleton width="100%" height={56} borderRadius={16} style={{ marginBottom: 24 }} />

        {/* Overview title */}
        <View className="mb-2">
          <Skeleton width={100} height={24} borderRadius={6} />
        </View>

        {/* Overview text */}
        <View className="mb-8">
          <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={16} borderRadius={4} />
        </View>

        {/* Cast title */}
        <View className="mb-4">
          <Skeleton width={60} height={24} borderRadius={6} />
        </View>

        {/* Cast items */}
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} className="flex-row items-center mb-3">
            <Skeleton width={48} height={48} borderRadius={24} />
            <View className="flex-1 ml-3">
              <Skeleton width="60%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
              <Skeleton width="40%" height={12} borderRadius={4} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};