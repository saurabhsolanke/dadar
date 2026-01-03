import HotelCard from '@/src/components/HotelCard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

import { AppHeaderRight } from '@/src/components/AppHeaderRight';
import { db } from '@/src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

interface EventItem {
    id: string;
    title: string;
    distance: string;
    rating: number;
    image: { uri: string };
}

export default function EventScreen() {
    const router = useRouter();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    const navigateTocontactus = () => {
        router.push({
            pathname: '/contact',
        });
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'events'));
                const eventsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || 'https://via.placeholder.com/150';
                    return {
                        id: doc.id,
                        title: data.title,
                        distance: data.location,
                        rating: 4.5, // Default rating as events might not have it
                        image: { uri: imageUrl }
                    };
                });
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const navigateToEvent = (id: string, title: string) => {
        router.push({
            pathname: '/event/[id]',
            params: { id, title }
        });
    };

       const renderItem = ({ item }: { item: EventItem }) => (
            <HotelCard
                key={item.id}
                {...item}
                width={CARD_WIDTH}
                height={240}
                onPress={() => navigateToEvent(item.id, item.title)}
            />
        );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: 'Historical Event',
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
                        style={styles.content}
                        placeholder="Search Hotel,Places,Events"
                        placeholderTextColor="#666"
                        editable={false}
                        pointerEvents="none"
                    />
                    <FontAwesome name="search" size={20} color="#000" />
                </TouchableOpacity>

                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>Events</Text>
                    <TouchableOpacity style={styles.organiseButton} onPress={navigateTocontactus}>
                        <Text style={styles.organiseText}>Organise Your Event</Text>
                    </TouchableOpacity>
                </View>
                

                <View style={styles.content}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                    ) : (
                          <FlatList
                            data={events}
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
           marginHorizontal: 20,
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
           marginLeft: 20, // Keep left margin for alignment
       },
       headerRow: {
           flexDirection: 'row',
           justifyContent: 'space-between',
           alignItems: 'center',
           paddingRight: 20, // Padding for the button
           marginBottom: 15,
           marginTop: 10,
       },
       organiseButton: {
           backgroundColor: '#FFD700', // Yellow
           paddingVertical: 8,
           paddingHorizontal: 15,
           borderRadius: 20,
       },
       organiseText: {
           fontSize: 13, // Slightly larger for readability
           fontWeight: 'bold',
           color: '#000',
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