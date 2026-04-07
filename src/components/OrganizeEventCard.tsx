import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { db } from '@/src/config/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

const { width: viewportWidth } = Dimensions.get('window');

interface EventData {
    id: string;
    title: string;
    description: string;
    image: string;
}

interface OrganizeEventCardProps {
    onPress?: (id: string, title: string) => void;
}

export default function OrganizeEventCard({ onPress }: OrganizeEventCardProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsQuery = query(collection(db, 'events'), limit(5));
                const snapshot = await getDocs(eventsQuery);
                
                const eventsList: EventData[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    eventsList.push({
                        id: doc.id,
                        title: data.title || 'Event',
                        description: data.description || '',
                        image: data.image || (data.images && data.images.length > 0 ? data.images[0] : 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1000&auto=format&fit=crop'),
                    });
                });
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching events for Carousel:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        if (slideSize === 0) return;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    const dynamicStyles = {
        card: { 
            backgroundColor: isDark ? '#1c1c1e' : '#fff',
            shadowColor: isDark ? '#fff' : '#000',
        },
        title: { color: isDark ? '#fff' : '#000' },
        description: { color: isDark ? '#ccc' : '#666' },
        buttonText: { color: '#000' },
        paginationDotInactive: { backgroundColor: isDark ? '#444' : '#ccc' },
    };

    if (loading) {
        return (
            <View style={[styles.loadingCard, dynamicStyles.card]}>
                <ActivityIndicator color={isDark ? "#fff" : "#FFD700"} />
            </View>
        );
    }

    if (events.length === 0) return null;

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={viewportWidth}
            >
                {events.map((item) => (
                    <View key={item.id} style={styles.cardWrapper}>
                        <TouchableOpacity 
                            activeOpacity={0.9} 
                            onPress={() => onPress?.(item.id, item.title)} 
                            style={[styles.card, dynamicStyles.card]}
                        >
                            <View style={styles.contentRow}>
                                <Image 
                                    source={{ uri: item.image }} 
                                    style={styles.image} 
                                    resizeMode="cover" 
                                />
                                <View style={styles.textContainer}>
                                    <Text style={[styles.title, dynamicStyles.title]} numberOfLines={1}>{item.title}</Text>
                                    <Text style={[styles.description, dynamicStyles.description]} numberOfLines={3}>
                                        {item.description}
                                    </Text>
                                    <TouchableOpacity style={styles.button} onPress={() => onPress?.(item.id, item.title)}>
                                        <Text style={[styles.buttonText, dynamicStyles.buttonText]}>Inquiry Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            {events.length > 1 && (
                <View style={styles.paginationContainer}>
                    {events.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                activeIndex === index ? styles.paginationDotActive : dynamicStyles.paginationDotInactive
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    loadingCard: {
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 16,
        height: 152,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardWrapper: {
        width: viewportWidth,
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 20,
        padding: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        minHeight: 152,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 16,
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#FFD700',
        width: 20, // Elongated active dot
    },
    paginationDotInactive: {
        backgroundColor: '#ccc',
    },
});
