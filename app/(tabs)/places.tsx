import { AppHeaderRight } from '@/src/components/AppHeaderRight';
import HotelCard from '@/src/components/HotelCard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 24 padding on each side (approx)

import SkeletonLoader from '@/src/components/SkeletonLoader';
import { db } from '@/src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface PlaceItem {
    id: string;
    title: string;
    distance: string;
    rating: number;
    image: { uri: string };
}

import { useTheme } from '@/src/context/ThemeContext';

export default function PlacesScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [places, setPlaces] = useState<PlaceItem[]>([]);
    const [loading, setLoading] = useState(true);

    const dynamicStyles = {
        container: { backgroundColor: isDark ? '#000' : '#fff' },
        text: { color: isDark ? '#fff' : 'black' },
        searchContainer: { 
            backgroundColor: isDark ? '#1c1c1e' : '#F5F5F5',
            borderColor: isDark ? '#333' : '#000',
        },
        searchIcon: { color: isDark ? '#888' : '#000' },
        placeholderText: { color: isDark ? '#888' : '#666' },
        headerIcon: { color: isDark ? '#fff' : 'black' },
    };

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'places'));
                const placesList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || ' ';
                    return {
                        id: doc.id,
                        title: data.title,
                        distance: data.location,
                        rating: data.rating,
                        image: { uri: imageUrl }
                    };
                });
                setPlaces(placesList);
            } catch (error) {
                console.error("Error fetching places:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    const navigateToPlace = (id: string, title: string) => {
        router.push({
            pathname: '/place/[id]',
            params: { id, title }
        });
    };

    const renderItem = ({ item }: { item: PlaceItem }) => (
        <HotelCard
            key={item.id}
            {...item}
            width={CARD_WIDTH}
            height={240}
            onPress={() => navigateToPlace(item.id, item.title)}
        />
    );

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            {/* Custom Header to match the screenshot 'Historical Places' */}
            <Stack.Screen
                options={{
                    headerTitle: 'Places',
                    headerStyle: { backgroundColor: isDark ? '#000' : '#fff' },
                    headerTintColor: isDark ? '#fff' : '#000',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                            <FontAwesome name="arrow-left" size={20} color={dynamicStyles.headerIcon.color} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => <AppHeaderRight />,
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: isDark ? '#fff' : '#000',
                    }
                }}
            />

            {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}> */}
            {/* Search Bar */}
            <TouchableOpacity
                style={[styles.searchContainer, dynamicStyles.searchContainer]}
                activeOpacity={1}
                onPress={() => router.push('/search')}
            >
                <TextInput
                    style={styles.contentInput}
                    placeholder="Search Hotel,Places,Events"
                    placeholderTextColor={dynamicStyles.placeholderText.color}
                    editable={false}
                    pointerEvents="none"
                />
                <FontAwesome name="search" size={20} color={dynamicStyles.searchIcon.color} />
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, dynamicStyles.text]}>Places</Text>

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
                        data={places}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />

                    // places.map((item) => (
                    //     <HotelCard
                    //         key={item.id}
                    //         {...item}
                    //         width={CARD_WIDTH}
                    //         height={220} // Slightly taller for grid look
                    //         onPress={() => navigateToPlace(item.id, item.title)}
                    //     />
                    // ))
                )}
            </View>

            {/* Bottom padding for tab bar */}
            <View style={{ height: 80 }} />
            {/* </ScrollView> */}
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
    //    headerTop: {
    //        flexDirection: 'row',
    //        justifyContent: 'space-between',
    //        alignItems: 'center',
    //        marginBottom: 15,
    //    },
    //    headerTitle: {
    //        fontSize: 18,
    //        fontWeight: 'bold',
    //        display: 'none', // Hidden based on design, often handled by navigation header or just custom
    //    },
    //    searchPlaceholder: {
    //        color: '#999',
    //        fontSize: 14,
    //    },
});