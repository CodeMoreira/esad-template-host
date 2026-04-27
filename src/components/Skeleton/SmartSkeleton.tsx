import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../theme/tokens';

interface SmartSkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: keyof typeof Theme.radius;
  style?: ViewStyle;
}

export const SmartSkeleton: React.FC<SmartSkeletonProps> = ({
  width = '100%',
  height = 20,
  radius = 's',
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: Theme.radius[radius],
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Theme.colors.light,
  },
});
