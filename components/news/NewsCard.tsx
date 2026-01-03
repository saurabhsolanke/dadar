import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NewsCardProps {
    image: string;
    title: string;
    description: string;
    onPress?: () => void;
}

export default function NewsCard({ image, title, description, onPress }: NewsCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                    {description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        padding: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    content: {
        padding: 8,
        paddingTop: 0,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#000',
        lineHeight: 20,
    },
    description: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
});
