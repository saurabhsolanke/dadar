import { useTheme } from '@/src/context/ThemeContext';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BannerItem, subscribeToBanners } from '../services/banners';

const { width } = Dimensions.get('window');

export default function BannerCarousel() {
    const [banners, setBanners] = useState<BannerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const unsubscribe = subscribeToBanners((data) => {
            setBanners(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        if (slideSize === 0) return;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    const dynamicStyles = {
        dateTag: { backgroundColor: isDark ? '#1c1c1e' : '#fff' },
        dateText: { color: isDark ? '#FFD700' : '#000' },
        paginationDotInactive: { backgroundColor: isDark ? '#444' : '#ccc' },
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="small" color="#FFD700" />
            </View>
        );
    }

    if (banners.length === 0) return null;

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
                {banners.map((item) => (
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
                        <View style={[styles.dateTag, dynamicStyles.dateTag]}>
                            <Text style={[styles.dateText, dynamicStyles.dateText]}>{item.date}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            activeIndex === index ? styles.paginationDotActive : dynamicStyles.paginationDotInactive
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
    center: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
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
