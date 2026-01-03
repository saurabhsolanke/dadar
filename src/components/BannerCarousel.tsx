import React, { useState } from 'react';
import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface BannerItem {
    id: string;
    title: string;
    subtitle: string;
    location: string;
    date: string;
    image: string;
    link?: string;
}

const DUMMY_BANNERS: BannerItem[] = [
    {
        id: '1',
        title: 'Dadar Walkathon',
        subtitle: 'Step for Health!',
        location: '📍 Shivaji Park, Dadar (West)',
        date: 'Sun, 3rd Aug | 6:30 AM Onwards',
        image: 'https://images.unsplash.com/photo-1533227297464-90aa2286786a?fit=crop&w=800&q=80',
    },
    {
        id: '2',
        title: 'Mumbai Food Fest',
        subtitle: 'Taste of Dadar',
        location: '📍 Dadar Chowpatty',
        date: 'Fri, 15th Aug | 5:00 PM Onwards',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?fit=crop&w=800&q=80',
    },
    {
        id: '3',
        title: 'Cultural Night',
        subtitle: 'Music & Dance',
        location: '📍 Plaza Theatre',
        date: 'Sat, 20th Sep | 7:00 PM',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?fit=crop&w=800&q=80',
    }
];

export default function BannerCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContent}
            >
                {DUMMY_BANNERS.map((item) => (
                    <TouchableOpacity key={item.id} activeOpacity={0.9} style={styles.bannerContainer}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                        <View style={styles.bannerOverlay}>
                            <Text style={styles.bannerTitle}>{item.title}</Text>
                            <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                            <Text style={styles.bannerLocation}>{item.location}</Text>
                            <View style={styles.registerButton}>
                                <Text style={styles.registerText}>Register Now</Text>
                            </View>
                        </View>
                        <View style={styles.dateTag}>
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
                {DUMMY_BANNERS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            activeIndex === index ? styles.paginationDotActive : styles.paginationDotInactive
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    scrollContent: {
        // paddingHorizontal: 20, // Removing horizontal padding to allow full width swipe, but bannerContainer has margin
    },
    bannerContainer: {
        width: width - 40, // Full width minus margin
        marginHorizontal: 20,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20,
        justifyContent: 'center',
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bannerSubtitle: {
        color: '#FFD700', // Yellow
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    bannerLocation: {
        color: '#fff',
        fontSize: 12,
        marginBottom: 12,
    },
    registerButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    registerText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#000',
    },
    dateTag: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopLeftRadius: 12,
    },
    dateText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#FFD700', // Yellow
        width: 20, // Elongated active dot
    },
    paginationDotInactive: {
        backgroundColor: '#ccc',
    },
});
