import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { Theme } from '../../theme/tokens';

interface TypographyProps {
  variant?: keyof typeof Theme.typography;
  color?: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = Theme.colors.white,
  align = 'left',
  bold,
  children,
  style,
}) => {
  const baseStyle = Theme.typography[variant];
  
  return (
    <Text
      style={[
        baseStyle,
        { color, textAlign: align },
        bold && { fontWeight: '700' },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
