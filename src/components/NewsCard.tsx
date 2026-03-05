import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 12;
const CONTAINER_PADDING = 16;
const DEFAULT_CARD_WIDTH = (SCREEN_WIDTH - (CONTAINER_PADDING * 2) - COLUMN_GAP) / 2;

interface NewsCardProps {
    title: string;
    content: string; // Used as subtitle/author area like distance
    image: any;
    author?: string;
    onPress?: () => void;
    width?: number;
    height?: number;
}

import { useTheme } from '@/src/context/ThemeContext';

export default function NewsCard({ 
    title, 
    content, 
    image, 
    author, 
    onPress, 
    width = DEFAULT_CARD_WIDTH, 
    height = 250 
}: NewsCardProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Helper to process image source
    let source = image;
    if (image && typeof image === 'object' && image.uri && typeof image.uri === 'string') {
        const url = image.uri;
        if (url.includes('cloudinary.com') && url.endsWith('.heic')) {
            source = { ...image, uri: url.replace('.heic', '.jpg') };
        }
    }

    const dynamicStyles = {
        card: { backgroundColor: isDark ? '#1c1c1e' : '#fff' },
        headline: { color: isDark ? '#fff' : '#000' },
        summary: { color: isDark ? '#ccc' : '#666' },
        author: { color: isDark ? '#888' : '#888' },
        imageBg: { backgroundColor: isDark ? '#333' : '#f0f0f0' },
    };

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.card, { width, height }, dynamicStyles.card]}>
            <View style={[styles.imageContainer, { height: height - 80 }, dynamicStyles.imageBg]}>
                <Image source={source} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.infoContainer}>
                {author && <Text style={[styles.author, dynamicStyles.author]} numberOfLines={1}>{author}</Text>}
                <Text style={[styles.headline, dynamicStyles.headline]} numberOfLines={1}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        marginRight: 15,
    },
    imageContainer: {
        width: '100%',
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: 12,
        justifyContent: 'center',
    },
    author: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    headline: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});
