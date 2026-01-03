import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HotelCardProps {
    id: string;
    title: string;
    distance: string;
    rating: number;
    image: any; // Using any for require() images or {uri}
    onPress: () => void;
    width?: number;
    height?: number;
}

export default function HotelCard({ id, title, distance, rating, image, onPress, width = 200, height = 250 }: HotelCardProps) {
    // Helper to process image source
    let source = image;
    if (image && typeof image === 'object' && image.uri && typeof image.uri === 'string') {
        const url = image.uri;
        if (url.includes('cloudinary.com') && url.endsWith('.heic')) {
            source = { ...image, uri: url.replace('.heic', '.jpg') };
        }
    }

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.card, { width }]}>
            <View style={[styles.imageContainer, { height: height - 80 }]}>
                <Image source={source} style={styles.image} resizeMode="cover" />
                <View style={styles.ratingBadge}>
                    <FontAwesome name="star" size={12} color="#fff" style={{ marginRight: 4 }} />
                    <Text style={styles.ratingText}>{rating}</Text>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.distance}>{distance}</Text>
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
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: '#4CAF50', // Green rating
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    infoContainer: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    distance: {
        fontSize: 12,
        color: '#666',
    },
});
