// src/screens/AuthLockScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Vibration,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { mockUser } from '../data/mockData';

interface AuthLockScreenProps {
  onUnlockSuccess: () => void;
}

const CORRECT_PIN = '1234';

export const AuthLockScreen: React.FC<AuthLockScreenProps> = ({
  onUnlockSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('Biometrics');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check hardware biometric availability on mount
  useEffect(() => {
    const checkBiometrics = async () => {
      if (Platform.OS === 'web') return;

      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        setHasBiometrics(true);
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        }

        // Auto prompt biometrics on launch
        triggerBiometricPrompt();
      }
    };

    checkBiometrics();
  }, []);

  const triggerBiometricPrompt = async () => {
    try {
      if (Platform.OS === 'web') {
        onUnlockSuccess();
        return;
      }

      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) {
        Alert.alert(
          'Biometrics Not Enrolled',
          'Biometric hardware is not enrolled on this device or emulator. Use PIN 1234 or 0000 to enter.',
          [
            { text: 'Use PIN', style: 'cancel' },
            { text: 'Bypass (Demo)', onPress: () => onUnlockSuccess() },
          ]
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Pulse Money',
        cancelLabel: 'Use PIN',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        onUnlockSuccess();
      }
    } catch (e) {
      console.log('Biometric prompt error:', e);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMessage('');

      if (nextPin.length === 4) {
        validatePin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMessage('');
    }
  };

  const validatePin = (inputPin: string) => {
    if (inputPin === CORRECT_PIN || inputPin === '0000') {
      onUnlockSuccess();
    } else {
      Vibration.vibrate(400);
      setErrorMessage('Incorrect PIN. Try 1234 or use Face ID.');
      setTimeout(() => setPin(''), 500);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Feather name="zap" size={32} color={Colors.brandPrimary} />
          </View>
          <Text style={styles.brandTitle}>Pulse Money</Text>
          <Text style={styles.greetingText}>
            Welcome back, {mockUser.name}
          </Text>
          <Text style={styles.instructionsText}>
            Enter 4-digit PIN or use {biometricType}
          </Text>
        </View>

        {/* PIN Indicator Dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isFilled && styles.dotFilled,
                  errorMessage !== '' && styles.dotError,
                ]}
              />
            );
          })}
        </View>

        {/* Error Note */}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']].map(
            (row, rIdx) => (
              <View key={rIdx} style={styles.keypadRow}>
                {row.map((digit) => (
                  <Pressable
                    key={digit}
                    style={({ pressed }) => [
                      styles.keyButton,
                      pressed && styles.keyPressed,
                    ]}
                    onPress={() => handleKeyPress(digit)}
                  >
                    <Text style={styles.keyText}>{digit}</Text>
                  </Pressable>
                ))}
              </View>
            )
          )}

          {/* Bottom Row: Biometrics, 0, Backspace */}
          <View style={styles.keypadRow}>
            {/* Biometric Action */}
            <Pressable
              style={({ pressed }) => [
                styles.keyButtonSpecial,
                pressed && { opacity: 0.6 },
              ]}
              onPress={triggerBiometricPrompt}
            >
              <Feather
                name={biometricType === 'Face ID' ? 'smile' : 'shield'}
                size={26}
                color={Colors.brandPrimary}
              />
              <Text style={styles.specialKeyLabel}>{biometricType}</Text>
            </Pressable>

            {/* Zero Key */}
            <Pressable
              style={({ pressed }) => [
                styles.keyButton,
                pressed && styles.keyPressed,
              ]}
              onPress={() => handleKeyPress('0')}
            >
              <Text style={styles.keyText}>0</Text>
            </Pressable>

            {/* Delete / Backspace */}
            <Pressable
              style={({ pressed }) => [
                styles.keyButtonSpecial,
                pressed && { opacity: 0.6 },
              ]}
              onPress={handleDelete}
            >
              <Feather name="delete" size={24} color={Colors.textMain} />
            </Pressable>
          </View>
        </View>

        {/* Quick Demo Hint */}
        <Text style={styles.hintText}>Demo PIN: 1234 or 0000</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 13,
    color: Colors.textLight,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginVertical: Spacing.md,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
    transform: [{ scale: 1.1 }],
  },
  dotError: {
    backgroundColor: Colors.dangerMain,
    borderColor: Colors.dangerMain,
  },
  errorContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 13,
    color: Colors.dangerMain,
    fontWeight: '600',
  },
  keypad: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  keyPressed: {
    backgroundColor: Colors.brandSoft,
    transform: [{ scale: 0.95 }],
  },
  keyText: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textMain,
  },
  keyButtonSpecial: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  specialKeyLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.brandPrimary,
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textLight,
  },
});
