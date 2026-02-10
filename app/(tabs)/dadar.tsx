import ExperienceCard from '@/src/components/ExperienceCard';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { db } from '@/src/config/firebase'; // Ensure alias or relative path works
import { useTheme } from '@/src/context/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome'; // Use FontAwesome
import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    image: { uri: string };
    type: 'news' | 'blog';
    author?: string; // Added optional author
}

export default function Dadar() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'experience'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);

                const fetchedData: NewsItem[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.isApproved) {
                        // Normalize image data
                        const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || '  ';

                        fetchedData.push({
                            id: doc.id,
                            title: data.title || 'Untitled',
                            description: data.description || '',
                            image: { uri: imageUrl },
                            type: 'news', // Kept generic for card, but data is experience
                            author: data.author || 'Anonymous',
                        });
                    }
                });

                setNews(fetchedData);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const dynamicStyles = {
        container: { backgroundColor: isDark ? '#000' : '#fff' },
        text: { color: isDark ? '#fff' : 'black' },
        tabContainer: { backgroundColor: isDark ? '#000' : '#fff', borderBottomColor: isDark ? '#333' : '#eee' },
        tabText: { color: isDark ? '#888' : '#888' }, // Inactive tab text color
        activeTabText: { color: isDark ? '#fff' : 'black' },
        iconColor: isDark ? '#fff' : 'black',
        listContent: { backgroundColor: isDark ? '#000' : '#fff' }, // Ensure list background matches
    };

    const handlePress = (id: string, title: string) => {
        // Experience details page could be different, but using news detail for now or just generic
        router.push({
            pathname: '/experience/[id]',
            params: { id, title }
        });
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            {/* Header handled in _layout.tsx */}
            <View style={[styles.tabContainer, dynamicStyles.tabContainer]}>
                <TouchableOpacity style={styles.tab} onPress={() => router.push('/news-feed')}>
                      <FontAwesome name="newspaper-o" size={14} color={dynamicStyles.iconColor} style={{ marginRight: 2 }} />
                    <Text style={[styles.tabText, dynamicStyles.tabText]}>News</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{paddingVertical: 12,  gap: 8,}} onPress={() => router.push('/write-experience')}>
                    <Text style={[styles.tabText, dynamicStyles.tabText]}> <FontAwesome name="pencil" size={14} color={dynamicStyles.iconColor} style={{ marginRight: 2 }} /> Write Experience</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => router.push('/map')}>
                    <FontAwesome name="map-marker" size={14} color={dynamicStyles.iconColor} style={{ marginRight: 2 }} />
                    <Text style={[styles.tabText, dynamicStyles.tabText]}>Map</Text> 
                </TouchableOpacity>
            </View>


            {/* <View style={styles.subHeader}>
                <View style={styles.subHeaderLeft}>
                    <TouchableOpacity onPress={() => router.push('/news-feed')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="newspaper-o" size={14} color="black" style={{ marginRight: 8 }} />
                        <Text style={styles.subHeaderTitle}>Read News & Blogs</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.writeButton} onPress={() => router.push('/write-experience')}>
                    <Text style={styles.writeButtonText}>Write Your Experience</Text>
                </TouchableOpacity>
            </View> */}

            {loading ? (
                <View style={[styles.listContent, dynamicStyles.listContent]}>
                  <View style={styles.row}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <View key={i} style={{ width: '48%', marginBottom: 15 }}>
                        <SkeletonLoader height={200} borderRadius={12} style={{ marginBottom: 8 }} />
                        <SkeletonLoader height={16} width="80%" borderRadius={4} style={{ marginBottom: 4 }} />
                        <SkeletonLoader height={14} width="60%" borderRadius={4} />
                      </View>
                    ))}
                  </View>
                </View>
            ) : (
                <FlatList
                    data={news}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ExperienceCard
                            image={item.image}
                            title={item.title}
                            content={item.description}
                            author={item.author}
                            onPress={() => handlePress(item.id, item.title)}
                        />
                    )}
                    numColumns={2}
                    contentContainerStyle={[styles.listContent, dynamicStyles.listContent]}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<View style={styles.center}><ActivityIndicator /></View>}
                />
            )}
        </View>
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
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    subHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subHeaderTitle: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    writeButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    writeButtonText: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#000',
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    row: {
        justifyContent: 'space-between',
        gap: 12,
    },

    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#FFD700',
    },
    tabText: {
        fontSize: 16,
        color: '#888',
        fontWeight: '500',
    },
    activeTabText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
