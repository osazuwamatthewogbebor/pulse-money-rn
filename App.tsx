// App.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/constants/theme';
import { TabType } from './src/types';
import { HomeScreen } from './src/screens/HomeScreen';
import { InsightsScreen } from './src/screens/InsightsScreen';
import { CardsScreen } from './src/screens/CardsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { BottomTabBar } from './src/components/BottomTabBar';
import { AuthLockScreen } from './src/screens/AuthLockScreen';
import { SplashScreen } from './src/screens/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // 1. Splash Screen on Initial Cold Start
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. PIN / Biometric Auth Lock Screen
  if (!isUnlocked) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthLockScreen onUnlockSuccess={() => setIsUnlocked(true)} />
      </SafeAreaProvider>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigateToTab={setActiveTab} />;
      case 'analytics':
        return <InsightsScreen />;
      case 'cards':
        return <CardsScreen />;
      case 'profile':
        return <ProfileScreen onLockApp={() => setIsUnlocked(false)} />;
      default:
        return <HomeScreen onNavigateToTab={setActiveTab} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Main Screen Content */}
        <View style={styles.screenContainer}>{renderActiveScreen()}</View>

        {/* Fixed Bottom Tab Bar */}
        <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  screenContainer: {
    flex: 1,
  },
});
