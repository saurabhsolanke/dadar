import { logScreenView } from '@/src/services/logging';
import { Stack, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../../src/config/firebase';

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        logScreenView(`Blog_Detail_${id}`);

        const fetchDetail = async () => {
            if (!id || typeof id !== 'string') return;
            setLoading(true);
            try {
                const docRef = doc(db, 'blogs', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setItem(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching blog detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.center}>
                <Text>Blog post not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: 'Blog Details' }} />

            <Text style={styles.headerTitle}>{item.title}</Text>

            {(() => {
                const imageUrl = Array.isArray(item.image) 
                    ? item.image[0] 
                    : item.image || (item.images && item.images.length > 0 ? item.images[0] : null);

                if (imageUrl) {
                    return <Image source={{ uri: imageUrl }} style={styles.image} />;
                }
                return null;
            })()}

            <View style={styles.contentContainer}>
                {item.author && (
                    <Text style={styles.author}>By {item.author}</Text>
                )}
                <Text style={styles.content}>{item.description || item.content}</Text>
            </View>

            <View style={styles.relatedContainer}>
                <Text style={styles.relatedTitle}>Related Blogs</Text>
                {/* Placeholders for related blogs */}
                <View style={styles.relatedCard} />
                <View style={styles.relatedCard} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 16,
        color: '#000',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: 16,
    },
    author: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
        fontWeight: '500',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        marginBottom: 16,
    },
    relatedContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    relatedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    relatedCard: {
        height: 100,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 8,
    }
});
