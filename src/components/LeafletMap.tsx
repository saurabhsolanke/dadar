import { Link } from 'expo-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix Leaflet's default icon path issues in Webpack/Expo
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface MapItem {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
}

interface LeafletMapProps {
    items: MapItem[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ items }) => {
    // Dadar Coords
    const centerPosition: [number, number] = [19.0178, 72.8478];

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <MapContainer center={centerPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {items.map((item) => (
                <Marker
                    key={item.id}
                    position={[item.latitude, item.longitude]}
                >
                    <Popup>
                        <div style={{ minWidth: '150px' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{item.title}</h3>
                            <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                                {truncateText(item.description, 60)}
                            </p>
                            <Link 
                                href={`/experience/${item.id}`} 
                                style={{ color: '#007AFF', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' } as any}
                            >
                                Read Full Story &rarr;
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default LeafletMap;
