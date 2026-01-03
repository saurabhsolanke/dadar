import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EventCardProps {
    title: string;
    description: string;
    image: any;
    onPress?: () => void;
    width?: number;
}

export default function EventCard({ title, description, image, onPress, width = 340 }: EventCardProps) {
    return (
        <View style={[styles.card, { width }]}>
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.description} numberOfLines={3}>{description}</Text>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>Inquiry Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 16,
        marginBottom: 10,
        flexDirection: 'row', // Horizontal layout
        height: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        overflow: 'hidden',
        padding: 12,
    },
    imageContainer: {
        width: 120,
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#FFD700', // Yellow button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
});
