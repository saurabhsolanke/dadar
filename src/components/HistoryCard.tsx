import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HistoryCardProps {
    title: string;
    description: string;
    est: string;
    image: any;
    onPress?: () => void;
    width?: number;
}

export default function HistoryCard({ title, description, est, image, onPress, width = 200 }: HistoryCardProps) {
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
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.description} numberOfLines={2}>{description}</Text>
                <View style={styles.footer}>
                    <Ionicons name="time" size={14} color="#007AFF" />
                    <Text style={styles.estText}>{est}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 150,
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    estText: {
        fontSize: 14,
        color: '#007AFF', // Blue color for the date
        fontWeight: '600',
    },
});
