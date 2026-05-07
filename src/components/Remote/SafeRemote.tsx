import React, { Component, ErrorInfo, ReactNode, Suspense, useMemo, lazy, useEffect, ComponentType } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { loadRemote, registerRemotes } from '@module-federation/runtime';
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
    console.error('[SafeRemote] Dynamic import failed or component crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={styles.errorContainer}>
          <Typography variant="h3" color={Theme.colors.error}>Module Unavailable</Typography>
          <Typography variant="caption" color={Theme.colors.gray1} align="center" style={{ marginTop: 8 }}>
            Failed to load or execute the remote module.
          </Typography>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => this.setState({ hasError: false })}
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
  moduleId: string;
  modulePath?: string; // Default to './Main' if not provided
  title?: string;
}

/**
 * SafeRemote — The heart of ESAD Dynamic Loading.
 * It uses Module Federation v2 (MFv2) loadRemote for pure dynamic resolution.
 */
export const SafeRemote: React.FC<SafeRemoteProps> = ({ moduleId, modulePath = './Main', title }) => {
  
  useEffect(() => {
    // Register the remote dynamically in the MFv2 runtime.
    // The ScriptManager resolver (index.js) will handle the actual URL resolution.
    registerRemotes([
      {
        name: moduleId,
        entry: moduleId, // Pointing to moduleId; resolver will intercept and provide the bundle URL
      },
    ]);
  }, [moduleId]);

  // Use MFv2 loadRemote instead of deprecated Federated.importModule
  const FederatedComponent = useMemo(() => {
    // MFv2 syntax: remoteName/exposedModule
    const cleanPath = modulePath.startsWith('./') ? modulePath.slice(2) : modulePath;
    
    return lazy(() => 
      loadRemote(`${moduleId}/${cleanPath}`) as Promise<{ default: ComponentType<any> }>
    );
  }, [moduleId, modulePath]);

  return (
    <View style={styles.container}>
      {title && <Typography variant="h3" style={styles.title}>{title}</Typography>}
      <SafeErrorBoundary>
        <Suspense fallback={<SmartSkeleton height={200} />}>
          <FederatedComponent />
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
