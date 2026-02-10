import { db } from '@/src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Lazy load the Leaflet map to avoid server-side SSR issues (window not defined)
const LeafletMap = React.lazy(() => import('./LeafletMap'));

interface MapItem {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
}

export default function MapTab() {
    const [items, setItems] = useState<MapItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (!isClient) {
        return null; // or a loading spinner
    }

    return (
        <View style={styles.container}>
            <Suspense fallback={
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFD700" />
                </View>
            }>
                <LeafletMap items={items} />
            </Suspense>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
