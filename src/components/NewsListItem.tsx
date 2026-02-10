import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NewsListItemProps {
    title: string;
    content: string;
    image: any;
    author?: string;
    onPress?: () => void;
}

import { useTheme } from '@/src/context/ThemeContext';

export default function NewsListItem({ title, content, image, author, onPress }: NewsListItemProps) {
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
        container: { 
            backgroundColor: isDark ? '#1c1c1e' : '#fff',
            borderBottomColor: isDark ? '#333' : '#f0f0f0',
        },
        title: { color: isDark ? '#fff' : '#000' },
        content: { color: isDark ? '#ccc' : '#666' },
        author: { color: isDark ? '#888' : '#999' },
        imageBg: { backgroundColor: isDark ? '#333' : '#f0f0f0' },
    };

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.container, dynamicStyles.container]}>
            <View style={styles.textContainer}>
                <Text style={[styles.title, dynamicStyles.title]} numberOfLines={3}>{title}</Text>
                <Text style={[styles.content, dynamicStyles.content]} numberOfLines={2}>{content}</Text>
                {author && <Text style={[styles.author, dynamicStyles.author]}>{author}</Text>}
            </View>
            <View style={[styles.imageContainer, dynamicStyles.imageBg]}>
                <Image source={source} style={styles.image} resizeMode="cover" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        lineHeight: 22,
    },
    content: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        marginBottom: 8,
    },
    author: {
        fontSize: 11,
        color: '#999',
    },
    imageContainer: {
        width: 100,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentContainer: { // Added to prevent TypeScript errors if referenced elsewhere, though not used in this specific component's previous code
        padding: 12,
    },
});
