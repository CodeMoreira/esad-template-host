import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../components/Typography/Typography';
import { Theme } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await signIn(username.trim(), password.trim());
      navigation.replace('Modules');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Typography variant="h1" align="center" color="#fff">
        ESAD SuperApp
      </Typography>
      <Typography
        variant="body"
        color={Theme.colors.gray1}
        align="center"
        style={styles.subtitle}>
        Access the ecosystem via Simple-CDN
      </Typography>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={Theme.colors.gray2}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="default"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Theme.colors.gray2}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Theme.colors.white} />
          ) : (
            <Typography variant="button">Sign In</Typography>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.darker,
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  subtitle: {
    marginTop: Theme.spacing.s,
    marginBottom: Theme.spacing.xl,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: Theme.colors.medium,
    color: Theme.colors.white,
    borderRadius: Theme.radius.m,
    padding: Theme.spacing.m,
    fontSize: 16,
    marginBottom: Theme.spacing.m,
    borderWidth: 1,
    borderColor: Theme.colors.light,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.m,
    padding: Theme.spacing.m,
    alignItems: 'center',
    marginTop: Theme.spacing.m,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
