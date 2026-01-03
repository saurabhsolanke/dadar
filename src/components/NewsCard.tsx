import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NewsCardProps {
    title: string;
    content: string;
    image: any;
    author?: string; // Added author prop
    onPress?: () => void;
    width?: number;
}

export default function NewsCard({ title, content, image, author, onPress, width = 200 }: NewsCardProps) {
    // Helper to process image source
    let source = image;
    if (image && typeof image === 'object' && image.uri && typeof image.uri === 'string') {
        const url = image.uri;
        if (url.includes('cloudinary.com') && url.endsWith('.heic')) {
            source = { ...image, uri: url.replace('.heic', '.jpg') };
        }
    }
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, { width }]}>
            <View style={styles.imageContainer}>
                <Image source={source} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.contentContainer}>
                 {author && <Text style={styles.author}>{author}</Text>}
                <Text style={styles.headline} numberOfLines={2}>{title}</Text>
                <Text style={styles.summary} numberOfLines={3}>{content}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 140, // Slightly reduced height
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 12,
    },
    author: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    headline: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 6,
        lineHeight: 22,
    },
    summary: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
});
