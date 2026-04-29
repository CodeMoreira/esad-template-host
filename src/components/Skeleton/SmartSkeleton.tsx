import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, StyleProp, DimensionValue } from 'react-native';
import { Theme } from '../../theme/tokens';

interface SmartSkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: keyof typeof Theme.radius;
  style?: StyleProp<ViewStyle>;
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
          width: width as any, // Cast to any because Animated.View style types can be tricky with DimensionValue
          height: height as any,
          borderRadius: Theme.radius[radius],
          opacity,
        },
        style as any,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Theme.colors.light,
  },
});
