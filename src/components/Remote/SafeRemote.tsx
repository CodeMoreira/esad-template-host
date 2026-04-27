import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../Typography/Typography';
import { SmartSkeleton } from '../Skeleton/SmartSkeleton';
import { Theme } from '../../theme/tokens';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SafeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SafeRemote] Crash detected:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={styles.errorContainer}>
          <Typography variant="h3" color={Theme.colors.error}>Module Unavailable</Typography>
          <Typography variant="caption" color={Theme.colors.gray1} align="center" style={{ marginTop: 8 }}>
            This feature crashed or failed to load.
          </Typography>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              // Try to clear ScriptManager cache to force a fresh network hit on the next Suspense bound
              try { require('@callstack/repack/client').ScriptManager.shared.invalidateScripts(); } catch(e){}
              this.setState({ hasError: false });
            }}
          >
            <Typography variant="button">Retry</Typography>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

interface SafeRemoteProps {
  children: ReactNode;
  title?: string;
}

export const SafeRemote: React.FC<SafeRemoteProps> = ({ children, title }) => {
  return (
    <View style={styles.container}>
      {title && <Typography variant="h3" style={styles.title}>{title}</Typography>}
      <SafeErrorBoundary>
        <Suspense fallback={<SmartSkeleton height={200} />}>
          {children}
        </Suspense>
      </SafeErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.m,
  },
  title: {
    marginBottom: Theme.spacing.s,
  },
  errorContainer: {
    padding: Theme.spacing.l,
    backgroundColor: Theme.colors.medium,
    borderRadius: Theme.radius.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.light,
  },
  retryButton: {
    marginTop: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.l,
    paddingVertical: Theme.spacing.s,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.s,
  },
});
