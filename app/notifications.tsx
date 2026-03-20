import { AppHeaderRight } from '@/src/components/AppHeaderRight';
import { useTheme } from '@/src/context/ThemeContext';
import { Notification, subscribeToNotifications } from '@/src/services/notifications';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToNotifications((data) => {
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const dynamicStyles = {
        container: { backgroundColor: isDark ? '#000' : '#fff' },
        item: { backgroundColor: isDark ? '#1c1c1e' : '#f8f9fa' },
        unreadItem: { 
            backgroundColor: isDark ? '#2c2c2e' : '#fff',
            borderColor: isDark ? '#444' : '#eee', 
        },
        title: { color: isDark ? '#fff' : '#000' },
        message: { color: isDark ? '#ccc' : '#555' },
        time: { color: isDark ? '#888' : '#888' },
        iconContainer: { backgroundColor: isDark ? '#333' : '#FFF9C4' },
    };

    if (loading) {
        return (
            <View style={[styles.container, dynamicStyles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Stack.Screen
                options={{
                    headerTitle: 'Notifications',
                    headerStyle: { backgroundColor: isDark ? '#000' : '#fff' },
                    headerTintColor: isDark ? '#fff' : '#000',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                            <FontAwesome name="arrow-left" size={20} color={isDark ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => <AppHeaderRight />,
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: isDark ? '#fff' : '#000',
                    },
                }}
            />
            {notifications.length === 0 ? (
                <View style={[styles.container, dynamicStyles.container, styles.centered]}>
                    <Text style={[styles.message, dynamicStyles.message]}>No notifications yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[
                            styles.notificationItem, 
                            dynamicStyles.item, 
                            !item.read && [styles.unreadItem, dynamicStyles.unreadItem]
                        ]}>
                            <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
                                <Text style={styles.iconText}>🔔</Text>
                            </View>
                            <View style={styles.contentContainer}>
                                <View style={styles.headerRow}>
                                    <Text style={[styles.title, dynamicStyles.title]}>{item.title}</Text>
                                    <Text style={[styles.time, dynamicStyles.time]}>{item.time}</Text>
                                </View>
                                <Text style={[styles.message, dynamicStyles.message]} numberOfLines={2}>{item.message}</Text>
                            </View>
                            {!item.read && <View style={styles.dot} />}
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
            <StatusBar style={isDark ? "light" : "dark"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF9C4', // Light yellow to match theme
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconText: {
        fontSize: 20,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        flex: 1,
    },
    time: {
        fontSize: 12,
        color: '#888',
        marginLeft: 8,
    },
    message: {
        fontSize: 14,
        color: '#555',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFD700',
        marginLeft: 8,
    },
});
