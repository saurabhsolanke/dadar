import { db } from '@/src/config/firebase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';

const { width } = Dimensions.get('window');

// Dadar Coordinates
const DADAR_REGION: Region = {
    latitude: 19.0178,
    longitude: 72.8478,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

interface MapItem {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
}

export default function MapTab() {
    const router = useRouter();
    const [items, setItems] = useState<MapItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'experience'));
                const mappedData: MapItem[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    let lat = 19.0178;
                    let lng = 72.8478;

                    if (data.location && data.location.latitude && data.location.longitude) {
                        lat = data.location.latitude;
                        lng = data.location.longitude;
                    } else if (data.latitude && data.longitude) {
                        lat = data.latitude;
                        lng = data.longitude;
                    } else {
                        // Random offset for demo if no location
                        const latOffset = (Math.random() - 0.5) * 0.01;
                        const lngOffset = (Math.random() - 0.5) * 0.01;
                        lat += latOffset;
                        lng += lngOffset;
                    }

                    mappedData.push({
                        id: doc.id,
                        title: data.title || 'Untitled',
                        description: data.description || '',
                        latitude: lat,
                        longitude: lng,
                    });
                });

                setItems(mappedData);
            } catch (error) {
                console.error("Error fetching map data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMapData();
    }, []);

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={DADAR_REGION}
                provider={PROVIDER_DEFAULT}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {items.map((item) => (
                    <Marker
                        key={item.id}
                        coordinate={{
                            latitude: item.latitude,
                            longitude: item.longitude,
                        }}
                        title={item.title}
                        description={item.description}
                        onCalloutPress={() => router.push(`/experience/${item.id}`)}
                    >
                        <FontAwesome name="map-marker" size={30} color="#E53935" />
                        <Callout>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{item.title}</Text>
                                <Text style={styles.calloutDesc}>
                                    {truncateText(item.description, 60)}
                                </Text>
                                <View style={styles.readMoreBtn}>
                                    <Text style={styles.readMoreText}>Read Full Story</Text>
                                    <FontAwesome name="angle-right" size={14} color="#007AFF" />
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    callout: {
        width: 200,
        padding: 5,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    calloutDesc: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    readMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 4,
    },
    readMoreText: {
        fontSize: 13,
        color: '#007AFF',
        fontWeight: '500',
    },
});
