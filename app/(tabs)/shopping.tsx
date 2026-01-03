import { AppHeaderRight } from '@/src/components/AppHeaderRight';
import HotelCard from '@/src/components/HotelCard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../src/config/firebase';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ShopItem {
    id: string;
    title: string;
    distance: string;
    rating: number;
    image: { uri: string };
}

export default function ShoppingScreen() {
    const router = useRouter();
    const [shops, setShops] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "shops"));
                const shopsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || 'https://via.placeholder.com/150';
                    return {
                        id: doc.id,
                        title: data.name,
                        image: { uri: imageUrl },
                        distance: data.location || "Unknown location",
                        rating: data.rating || 4.5,
                    };
                });
                setShops(shopsList);
            } catch (error) {
                console.error("Error fetching shops:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    const navigateToShop = (id: string, title: string) => {
        router.push(`/shop/${id}`);
    };

    const renderItem = ({ item }: { item: ShopItem }) => (
        <HotelCard
            key={item.id}
            {...item}
            width={CARD_WIDTH}
            height={240}
            onPress={() => navigateToShop(item.id, item.title)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: 'Shopping',
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

            {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}> */}
                {/* Search Bar */}
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

                <Text style={styles.sectionTitle}>Shops</Text>

                <View style={styles.content}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={shops}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={styles.columnWrapper}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                        />
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
        marginHorizontal: 20, // Added margin to match event.tsx logic if it was not full width
        marginTop: 10,
    },
    contentInput: { // Renamed from 'content' to avoid conflict or clarify
        flex: 1,
        paddingHorizontal: 15, // Adjusted to match event/places (styles.content)
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
