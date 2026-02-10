import { AppHeaderRight } from '@/src/components/AppHeaderRight';
import NewsCard from '@/src/components/NewsCard';
import NewsListItem from '@/src/components/NewsListItem';
import { db } from '@/src/config/firebase';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    image: { uri: string };
    type: 'news' | 'blog';
    author?: string;
}

export default function NewsFeed() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'news' | 'blog'>('news');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch from different collections based on active tab
                const collectionName = activeTab === 'news' ? 'news' : 'blogs';
                const q = query(collection(db, collectionName));
                const querySnapshot = await getDocs(q);

                const fetchedData: NewsItem[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || '  ';

                    fetchedData.push({
                        id: doc.id,
                        title: data.title || data.headline || 'Untitled',
                        description: data.description || data.summary || '',
                        image: { uri: imageUrl },
                        type: activeTab, // Explicitly set type based on source
                        author: data.author || (activeTab === 'news' ? 'Pravin Dabade' : 'Admin'),
                    });
                });

                setNews(fetchedData);
            } catch (error) {
                console.error(`Error fetching ${activeTab}:`, error);
                setNews([]); // Clear data on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]); // Re-fetch when tab changes

    const handlePress = (id: string, title: string) => {
        if (activeTab === 'news') {
            router.push({
                pathname: '/news/[id]',
                params: { id, title }
            });
        } else {
            router.push({
                pathname: '/blog/[id]',
                params: { id, title }
            });
        }
    };

    // Data is already filtered by the fetch effect
    const filteredData = news;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                headerTitle: "News & Blog",
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 0 }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                ),
                headerRight: () => <AppHeaderRight />
            }} />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'news' && styles.activeTab]}
                    onPress={() => setActiveTab('news')}
                >
                    <FontAwesome name="newspaper-o" size={18} color={activeTab === 'news' ? 'black' : '#888'} />
                    <Text style={[styles.tabText, activeTab === 'news' && styles.activeTabText]}>News</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'blog' && styles.activeTab]}
                    onPress={() => setActiveTab('blog')}
                >
                    <Ionicons name="documents-outline" size={20} color={activeTab === 'blog' ? 'black' : '#888'} />
                    <Text style={[styles.tabText, activeTab === 'blog' && styles.activeTabText]}>Blogs</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FFD700" />
                </View>
            ) : (
                <FlatList
                    key={activeTab} // Force re-render when switching layouts
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        if (activeTab === 'news') {
                            return (
                                <NewsListItem
                                    image={item.image}
                                    title={item.title}
                                    content={item.description}
                                    author={item.author}
                                    onPress={() => handlePress(item.id, item.title)}
                                />
                            );
                        } else {
                            return (
                                <NewsCard
                                    width={undefined}
                                    image={item.image}
                                    title={item.title}
                                    content={item.description}
                                    author={item.author}
                                    onPress={() => handlePress(item.id, item.title)}
                                />
                            );
                        }
                    }}
                    numColumns={activeTab === 'blog' ? 2 : 1}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={activeTab === 'blog' ? styles.row : undefined}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.center}><Text style={{ color: '#888', marginTop: 20 }}>No {activeTab === 'news' ? 'News' : 'Blogs'} Found</Text></View>
                    }
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
    listContent: {
        padding: 16,
        paddingTop: 16,
    },
    row: {
        justifyContent: 'space-between',
        gap: 12,
    },
});
