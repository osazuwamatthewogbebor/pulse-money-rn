import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants/theme';
import { TabType } from '../types';

interface TabItemConfig {
    id: TabType;
    label: string;
    icon: keyof typeof Feather.glyphMap;
};

const TABS: TabItemConfig[] = [
    { id: 'home', label: 'Home', icon: 'home' },
  { id: 'analytics', label: 'Analytics', icon: 'pie-chart' },
  { id: 'cards', label: 'Cards', icon: 'credit-card' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

interface BottomTabBarProps {
    activeTab: TabType;
    onTabPress: (tab: TabType) => void;
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
    activeTab,
    onTabPress,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingBottom: insets.bottom > 0 ? insets.bottom: Spacing.sm,
                },
            ]}
        >
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const color = isActive ? Colors.brandPrimary : Colors.textMuted;

                return (
                    <Pressable
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => onTabPress(tab.id)}
                    >
                        <Feather name={tab.icon} size={22} color={color}/>
                        <Text
                            style={[
                                styles.tabLabel,
                                {color},
                                isActive && styles.activeTabLabel,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingTop: Spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 10, // Android elevation for elevation shadow
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 64,
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});