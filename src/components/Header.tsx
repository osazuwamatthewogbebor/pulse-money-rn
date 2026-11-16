import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { UserProfile } from "../types";

interface HeaderProps {
    user: UserProfile;
    onNotificationPress?: () => void;
    onAvatarPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    user,
    onNotificationPress,
    onAvatarPress
}) => {
    return (
        <View style={styles.container}>
            {/* Left: User Profile & Greeting */}
            <Pressable style={styles.userSection}  onPress={onAvatarPress}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.initials}</Text>
                </View>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greetingText}>Welcome back,</Text>
                    <Text style={styles.userNameText}>{user.name}</Text>
                </View>
            </Pressable>

            {/* Right: Notification Bell Button */}
            <Pressable
                style={({pressed}) => [
                    styles.bellButton,
                    pressed && styles.bellButtonPressed,
                ]}
                onPress={onNotificationPress}
            >
                <Feather name="bell" size={20} color={Colors.textMain} />
                {user.unreadNotifications && <View style={styles.badgeDot} />}
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm + 4,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.brandSoft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.brandPrimary,
    },
    greetingContainer: {
        justifyContent: 'center',
    },
    greetingText: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '500',
    },
    userNameText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textMain,
        marginTop: 2,
    },
    bellButton: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderSubtle,
        position: 'relative',
    },
    bellButtonPressed: {
        backgroundColor: Colors.brandSoft,
    },
    badgeDot: {
        position: 'absolute',
        top: 10,
        right: 11,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.brandPrimary,
        borderWidth: 1.5,
        borderColor: Colors.surface,
    },
});