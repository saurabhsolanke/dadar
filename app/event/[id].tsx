import { db } from '@/src/config/firebase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface EventDetails {
    title: string;
    distance: string;
    rating: number;
    location: string;
    time: string;
    description: string;
    eventDetails: string;
    images: string[];
}

import { useTheme } from '@/src/context/ThemeContext';

export default function EventDetailsScreen() {
    const { id, title: paramTitle } = useLocalSearchParams();
    const router = useRouter();
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const dynamicStyles = {
        container: { backgroundColor: isDark ? '#000' : '#fff' },
        text: { color: isDark ? '#fff' : '#000' },
        subText: { color: isDark ? '#ccc' : '#666' },
        cardBackground: { backgroundColor: isDark ? '#1c1c1e' : '#f9f9f9' },
        specialtyItem: { 
            backgroundColor: isDark ? '#1c1c1e' : '#fff',
            borderColor: isDark ? '#333' : '#eee',
        },
        iconColor: isDark ? '#ccc' : '#666',
        historyContainer: { backgroundColor: isDark ? '#111' : '#f9f9f9' },
        bottomBar: { backgroundColor: isDark ? '#000' : '#fff' },
    };

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'events', id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                      // Helper to ensure HEIC images from Cloudinary work on all devices by converting to JPG
                    const formatImageUrl = (url: string) => {
                        if (typeof url === 'string' && url.includes('cloudinary.com') && url.endsWith('.heic')) {
                            return url.replace('.heic', '.jpg');
                        }
                        return url;
                    };

                    const rawImages = data.images || (data.image ? [data.image] : []) || [];
                    const processedImages = Array.isArray(rawImages) ? rawImages.map(formatImageUrl) : [];

                    setEvent({
                        title: data.title || (paramTitle as string) || 'Event',
                        distance: data.distance || '1.2 km from Dadar Station', // Fallback or fetch if available
                        rating: data.rating || 4.5,
                        location: data.location || 'Location details not available',
                        time: data.time || 'Time not specified',
                        description: data.description || 'No description available.',
                        eventDetails: data.eventDetails || data.description || 'No additional details.',
                        images: processedImages
                    });
                } else {
                    console.log("No such event!");
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, paramTitle]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, dynamicStyles.container]}>
                <ActivityIndicator size="large" color={isDark ? "#FFD700" : "#000"} />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={[styles.container, styles.centerContent, dynamicStyles.container]}>
                <Text style={dynamicStyles.text}>Event not found.</Text>
                <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
                    <Text style={{ color: 'blue' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header Image */}
                <View style={styles.headerContainer}>
                    {event.images && event.images.length > 0 ? (
                        <Image source={{ uri: event.images[0] }} style={styles.headerImage} resizeMode="cover" />
                    ) : (
                        <View style={[styles.headerImage, { backgroundColor: '#ccc' }]} />
                    )}
                    <View style={styles.overlay} />

                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        <View style={styles.ratingBadge}>
                            <FontAwesome name="star" size={12} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={styles.ratingText}>{event.rating}</Text>
                        </View>
                        <Text style={styles.title}>{event.title}</Text>
                        <Text style={styles.distance}>{event.distance}</Text>
                    </View>
                </View>

                {/* Info Cards */}
                <View style={[styles.infoRow, dynamicStyles.cardBackground]}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoIcon}>
                            <FontAwesome name="map-marker" size={16} color={dynamicStyles.iconColor} />
                        </View>
                        <View>
                            <Text style={[styles.infoLabel, dynamicStyles.text]}>Location</Text>
                            <Text style={[styles.infoValue, dynamicStyles.subText]}>{event.location}</Text>
                        </View>
                    </View>
                    <View style={[styles.infoCard, { marginLeft: 10 }]}>
                        <View style={styles.infoIcon}>
                            <FontAwesome name="clock-o" size={16} color={dynamicStyles.iconColor} />
                        </View>
                        <View>
                            <Text style={[styles.infoLabel, dynamicStyles.text]}>{event.time}</Text>
                        </View>
                    </View>
                </View>

                {/* Specialty */}
                <Text style={[styles.sectionHeader, dynamicStyles.text]}>Specialty</Text>
                <View style={styles.specialtyRow}>
                    <View style={[styles.specialtyItem, dynamicStyles.specialtyItem]}>
                        <FontAwesome name="wifi" size={24} color={dynamicStyles.iconColor} />
                        <Text style={[styles.specialtyText, dynamicStyles.text]}>WiFi</Text>
                    </View>
                    <View style={[styles.specialtyItem, dynamicStyles.specialtyItem]}>
                        <FontAwesome name="calendar" size={24} color={dynamicStyles.iconColor} />
                        <Text style={[styles.specialtyText, dynamicStyles.text]}>Event</Text>
                    </View>
                    <View style={[styles.specialtyItem, dynamicStyles.specialtyItem]}>
                        <FontAwesome name="group" size={24} color={dynamicStyles.iconColor} />
                        <Text style={[styles.specialtyText, dynamicStyles.text]}>Meeting space</Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={[styles.sectionHeader, dynamicStyles.text]}>Description</Text>
                <Text style={[styles.descriptionText, dynamicStyles.subText]}>{event.description}</Text>

                {/* Images */}
                <Text style={[styles.sectionHeader, dynamicStyles.text]}>Images</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
                    {event.images && event.images.map((img, index) => (
                        <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
                    ))}
                </ScrollView>

                {/* Event Details Text */}
                <View style={[styles.historyContainer, dynamicStyles.historyContainer]}>
                    <Text style={[styles.sectionHeader, { marginTop: 0 }, dynamicStyles.text]}>Event details</Text>
                    <Text style={[styles.descriptionText, dynamicStyles.subText]}>{event.eventDetails}</Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, dynamicStyles.bottomBar]}>
                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Event</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <FontAwesome name="share" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonSimple: {
        marginTop: 20,
        padding: 10,
    },
    scrollContent: {
        paddingBottom: 20
    },
    headerContainer: {
        height: 250,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    ratingBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    ratingText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    distance: {
        fontSize: 14,
        color: '#eee',
    },
    infoRow: {
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 12,
    },
    infoCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 12,
        color: '#666',
        flexWrap: 'wrap',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    specialtyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    specialtyItem: {
        width: width / 3 - 20,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    specialtyText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    descriptionText: {
        marginHorizontal: 20,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    galleryScroll: {
        paddingLeft: 20,
        marginTop: 10,
    },
    galleryImage: {
        width: 140,
        height: 100,
        borderRadius: 12,
        marginRight: 15,
    },
    historyContainer: {
        backgroundColor: '#f9f9f9',
        paddingVertical: 20,
        paddingBottom: 40,
        marginTop: 20
    },
    bottomBar: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
        zIndex: 100,
    },
    bookButton: {
        flex: 1,
        backgroundColor: '#FFD700',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    bookButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    shareButton: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});
