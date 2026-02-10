import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';

// Mock Data
const NOTIFICATIONS = [
    {
        id: '1',
        title: 'Welcome to Dadar!',
        message: 'Explore the best places, events, and shops in Dadar.',
        time: '2h ago',
        read: false,
    },
    {
        id: '2',
        title: 'New Event: Shivaji Park Ledger',
        message: 'Join us for a community meetup this Sunday at Shivaji Park.',
        time: '5h ago',
        read: true,
    },
    {
        id: '3',
        title: 'Shopping Sale Started',
        message: 'Get up to 50% off at Star Mall Dadar. Limited time offer.',
        time: '1d ago',
        read: true,
    },
    {
        id: '4',
        title: 'Flower Market Update',
        message: 'Fresh stock arrived at the Dadar Flower Market. Check it out!',
        time: '2d ago',
        read: true,
    },
];

import { useTheme } from '@/src/context/ThemeContext';

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: isDark ? '#000' : '#fff' },
                    headerTintColor: isDark ? '#fff' : '#000',
                }}
            />
            <FlatList
                data={NOTIFICATIONS}
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
            <StatusBar style={isDark ? "light" : "dark"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
