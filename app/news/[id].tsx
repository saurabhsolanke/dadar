import { logScreenView } from '@/src/services/logging';
import { Stack, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../../src/config/firebase';

export default function NewsDetailScreen() {
    const { id } = useLocalSearchParams();
    const [newsItem, setNewsItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        logScreenView(`News_Detail_${id}`);

        const fetchDetail = async () => {
            if (!id || typeof id !== 'string') return;
            setLoading(true);
            try {
                const docRef = doc(db, 'news', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setNewsItem(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching news detail:", error);
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

    if (!newsItem) {
        return (
            <View style={styles.center}>
                <Text>News item not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: 'News Detail' }} />

            <Text style={styles.headerTitle}>{newsItem.title}</Text>

            {(() => {
                const imageUrl = Array.isArray(newsItem.image) 
                    ? newsItem.image[0] 
                    : newsItem.image || (newsItem.images && newsItem.images.length > 0 ? newsItem.images[0] : null);

                if (imageUrl) {
                    return <Image source={{ uri: imageUrl }} style={styles.image} />;
                }
                return null;
            })()}

            <View style={styles.contentContainer}>
                <Text style={styles.content}>{newsItem.description || newsItem.content}</Text>
            </View>

            <View style={styles.relatedContainer}>
                <Text style={styles.relatedTitle}>Related News</Text>
                {/* Placeholders for related news - can be implemented later */}
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
