import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EventCardProps {
    title: string;
    description: string;
    image: any;
    onPress?: () => void;
    width?: number;
}

import { useTheme } from '@/src/context/ThemeContext';

export default function EventCard({ title, description, image, onPress, width = 200, height = 250 }: EventCardProps & { height?: number }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const dynamicStyles = {
        card: { backgroundColor: isDark ? '#1c1c1e' : '#fff' },
        title: { color: isDark ? '#fff' : '#000' },
        description: { color: isDark ? '#ccc' : '#666' },
        imageBg: { backgroundColor: isDark ? '#333' : '#f0f0f0' },
    };

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, { width, height }, dynamicStyles.card]}>
            <View style={[styles.imageContainer, { height: height - 80 }, dynamicStyles.imageBg]}>
                <Image source={image} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, dynamicStyles.title]} numberOfLines={1}>{title}</Text>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>Inquiry Now</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 16,
        marginBottom: 10,
        height: 250,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#FFD700', // Yellow button
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
});
