import { AppHeaderRight } from '@/src/components/AppHeaderRight';
import HotelCard from '@/src/components/HotelCard';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../src/config/firebase';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface HotelItem {
    id: string;
    title: string;
    distance: string;
    rating: number;
    image: { uri: string };
}

export default function HotelsScreen() {
    const router = useRouter();
    const [hotels, setHotels] = useState<HotelItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "hotels"));
                const hotelsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null);
                    return {
                        id: doc.id,
                        title: data.title,
                        image: { uri: imageUrl },
                        distance: data.location || "Unknown location",
                        rating: data.rating || 4.5,
                    };
                });
                setHotels(hotelsList);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const navigateToHotel = (id: string, title: string) => {
        router.push(`/hotel/${id}`);
    };

    const renderItem = ({ item }: { item: HotelItem }) => (
        <HotelCard
            key={item.id}
            {...item}
            width={CARD_WIDTH}
            height={240}
            onPress={() => navigateToHotel(item.id, item.title)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: 'Hotels',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                            <FontAwesome name="arrow-left" size={20} color="black" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => <AppHeaderRight />,
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold'
                    }
                }}
            />

            <TouchableOpacity
                style={styles.searchContainer}
                activeOpacity={1}
                onPress={() => router.push('/search')}
            >
                <TextInput
                    style={styles.contentInput}
                    placeholder="Search Hotel,Places,Events"
                    placeholderTextColor="#666"
                    editable={false}
                    pointerEvents="none"
                />
                <FontAwesome name="search" size={20} color="#000" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Hotels</Text>

            <View style={styles.content}>
                {loading ? (
                    <View style={styles.columnWrapper}>
                        <View style={{ width: '48%', marginBottom: 15 }}>
                            {[1, 2, 3, 4].map((i) => (
                                <View key={i} style={{ marginBottom: 15 }}>
                                    <SkeletonLoader height={240} borderRadius={12} style={{ marginBottom: 8 }} />
                                    <SkeletonLoader height={18} width="90%" borderRadius={4} style={{ marginBottom: 4 }} />
                                    <SkeletonLoader height={14} width="60%" borderRadius={4} />
                                </View>
                            ))}
                        </View>
                        <View style={{ width: '48%', marginBottom: 15 }}>
                             {[5, 6, 7, 8].map((i) => (
                                <View key={i} style={{ marginBottom: 15 }}>
                                    <SkeletonLoader height={240} borderRadius={12} style={{ marginBottom: 8 }} />
                                    <SkeletonLoader height={18} width="90%" borderRadius={4} style={{ marginBottom: 4 }} />
                                    <SkeletonLoader height={14} width="60%" borderRadius={4} />
                                </View>
                            ))}
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={hotels}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>

            <View style={{ height: 80 }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 10,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 50,
        borderWidth: 1,
        borderColor: '#000',
        marginHorizontal: 20,
        marginTop: 10,
    },
    contentInput: {
        flex: 1,
        paddingHorizontal: 15,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
        marginLeft: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
});
