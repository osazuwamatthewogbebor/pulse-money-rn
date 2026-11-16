// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse In Animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 1.4 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 1400);

    return () => clearTimeout(timer);
  }, [onFinish, scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow Ring & Logo */}
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <Feather name="zap" size={44} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.brandTitle}>Pulse</Text>
        <Text style={styles.brandTagline}>Intelligent Financial Flow</Text>
      </Animated.View>

      {/* Bottom Security Footer */}
      <View style={styles.footer}>
        <View style={styles.securityBadge}>
          <Feather name="shield" size={14} color="#10B981" />
          <Text style={styles.securityText}>256-Bit SSL Encrypted · FDIC Protected</Text>
        </View>
        <Text style={styles.versionText}>Pulse Money v1.0.4</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  brandTagline: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: Spacing.xs,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xl + 12,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  securityText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
