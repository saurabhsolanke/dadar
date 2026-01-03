import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Data for Markers (Hotels/Places/Events)
const MARKERS = [
    { id: '1', title: 'Dadar Station', latitude: 19.0178, longitude: 72.8478, type: 'transport' },
    { id: '2', title: 'Shivaji Park', latitude: 19.0269, longitude: 72.8383, type: 'park' },
    { id: '3', title: 'Siddhivinayak Temple', latitude: 19.0169, longitude: 72.8304, type: 'temple' },
    { id: '4', title: 'Portuguese Church', latitude: 19.0222, longitude: 72.8350, type: 'church' },
    { id: '5', title: 'Dr. Bhau Daji Lad Museum', latitude: 18.9790, longitude: 72.8347, type: 'museum' },
    { id: '6', title: 'Café Madras', latitude: 19.029, longitude: 72.855, type: 'food' },
];

export default function DadarMap() {
    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                provider={PROVIDER_DEFAULT} // Use Apple Maps on iOS, Google Maps on Android if configured
                style={styles.map}
                initialRegion={{
                    latitude: 19.0178,
                    longitude: 72.8478,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                }}
            >
                {MARKERS.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                        description={marker.type}
                    >
                        {/* Custom Marker Icon */}
                        <View style={styles.markerContainer}>
                            {marker.type === 'food' && <FontAwesome name="cutlery" size={20} color="#FFD700" />}
                            {marker.type !== 'food' && <FontAwesome name="map-marker" size={30} color="#FFD700" />}
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Search Bar Overlay */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Hotel,Places,Events"
                    placeholderTextColor="#666"
                />
                <FontAwesome name="search" size={20} color="#000" style={styles.searchIcon} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: width,
        height: height,
    },
    searchContainer: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    searchInput: {
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingRight: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    searchIcon: {
        position: 'absolute',
        right: 20,
        top: 15,
    },
    markerContainer: {
    }
});
