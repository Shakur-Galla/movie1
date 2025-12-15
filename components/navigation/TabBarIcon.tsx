// src/components/navigation/TabBarIcon.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabBarIconProps {
  name: IconName;
  color: string;
  size?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ 
  name, 
  color, 
  size = 24 
}) => {
  return <Ionicons name={name} size={size} color={color} />;
};