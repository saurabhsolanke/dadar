import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExperienceCardProps {
    title: string;
    content: string;
    image: any;
    author?: string;
    onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
// Calculate card width based on 2 columns with padding and gap
// Screen padding: 16px horizontal (total 32)
// Gap: 12px
// Available width = screenWidth - 32 - 12
const CARD_WIDTH = (screenWidth - 32 - 12) / 2;

export default function ExperienceCard({ title, content, image, author, onPress }: ExperienceCardProps) {
    // Helper to process image source
    let source = image;
    if (image && typeof image === 'object' && image.uri && typeof image.uri === 'string') {
        const url = image.uri;
        if (url.includes('cloudinary.com') && url.endsWith('.heic')) {
            source = { ...image, uri: url.replace('.heic', '.jpg') };
        }
    }

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={source} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.contentContainer}>
                 {author && <Text style={styles.author}>{author}</Text>}
                <Text style={styles.headline} numberOfLines={2}>{title}</Text>
                <Text style={styles.summary} numberOfLines={4}>{content}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 8, // Rounded corners
        marginBottom: 12, // Bottom spacing
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0', // Subtle border
    },
    imageContainer: {
        height: 120, // Image section height
        backgroundColor: '#f8f8f8',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 10,
    },
    author: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
        fontWeight: '500',
    },
    headline: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 6,
        lineHeight: 20,
    },
    summary: {
        fontSize: 12,
        color: '#555',
        lineHeight: 18,
    },
});
