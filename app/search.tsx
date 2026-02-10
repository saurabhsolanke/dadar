import { db } from '@/src/config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchResult {
    id: string;
    title: string;
    description?: string;
    image: { uri: string };
    type: 'hotel' | 'shop' | 'place' | 'event' | 'news' | 'blog';
}

import { useTheme } from '@/src/context/ThemeContext';

export default function SearchScreen() {
    const { q } = useLocalSearchParams<{ q: string }>();
    const [queryText, setQueryText] = useState(q || '');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const dynamicStyles = {
        container: { backgroundColor: isDark ? '#000' : '#fff' },
        header: { backgroundColor: isDark ? '#000' : '#fff', borderBottomColor: isDark ? '#333' : '#f0f0f0' },
        searchBar: { backgroundColor: isDark ? '#1c1c1e' : '#f5f5f5' },
        input: { color: isDark ? '#fff' : '#000' },
        iconColor: isDark ? '#888' : '#666',
        backIconColor: isDark ? '#fff' : 'black',
        resultItem: { backgroundColor: isDark ? '#000' : '#fff', borderBottomColor: isDark ? '#333' : '#f9f9f9' },
        resultTitle: { color: isDark ? '#fff' : '#333' },
        resultDesc: { color: isDark ? '#aaa' : '#888' },
        chevronColor: isDark ? '#555' : '#ccc',
        emptyText: { color: isDark ? '#888' : '#666' },
    };

    // Sync query text with URL param if it changes externally
    useEffect(() => {
        if (q) setQueryText(q);
    }, [q]);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            performSearch(queryText);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [queryText]);

    const performSearch = async (text: string) => {
        setLoading(true);
        const lowerText = text.toLowerCase();
        try {
            // Check if query is empty
            if (!text.trim()) {
                setResults([]);
                setLoading(false);
                return;
            }

            // NOTE: For Production, use Algolia or specialized search. 
            // For MVP, fetching smaller datasets and filtering client-side acts as a robust partial match search.

            const collectionsToSearch = [
                { name: 'hotels', type: 'hotel', titleField: 'title' },
                { name: 'shops', type: 'shop', titleField: 'name' }, // Note: shops use 'name'
                { name: 'places', type: 'place', titleField: 'title' },
                { name: 'events', type: 'event', titleField: 'title' },
                { name: 'news', type: 'news', titleField: 'headline' }, // Note: news might use headline or title
                { name: 'blogs', type: 'blog', titleField: 'title' },
            ];

            const allPromises = collectionsToSearch.map(async col => {
                const snapshot = await getDocs(collection(db, col.name));
                return snapshot.docs.map(doc => {
                    const data = doc.data();
                    const title = data[col.titleField] || data.title || 'Untitled';
                    // Simple client-side containment check
                    if (title.toLowerCase().includes(lowerText)) {
                        const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || '  ';
                        return {
                            id: doc.id,
                            title: title,
                            description: data.description || data.summary || data.location || '',
                            image: { uri: imageUrl },
                            type: col.type as any
                        };
                    }
                    return null;
                }).filter(item => item !== null) as SearchResult[];
            });

            const resultsArrays = await Promise.all(allPromises);
            const flatResults = resultsArrays.flat();
            setResults(flatResults);

        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = () => {
        router.push(`/search?q=${queryText}`);
    };

    const navigateToDetail = (item: SearchResult) => {
        const routes: Record<string, string> = {
            hotel: '/hotel/[id]',
            shop: '/shop/[id]',
            place: '/place/[id]',
            event: '/event/[id]',
            news: '/news/[id]',
            blog: '/blog/[id]',
        };
        const pathname = routes[item.type];
        if (pathname) {
            router.push({
                pathname: pathname as any,
                params: { id: item.id, title: item.title }
            });
        }
    };

    const renderItem = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity style={[styles.resultItem, dynamicStyles.resultItem]} onPress={() => navigateToDetail(item)}>
            <Image source={item.image} style={styles.resultImage} />
            <View style={styles.resultContent}>
                <View style={[styles.badge, { backgroundColor: getBadgeColor(item.type) }]}>
                    <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
                </View>
                <Text style={[styles.resultTitle, dynamicStyles.resultTitle]}>{item.title}</Text>
                <Text style={[styles.resultDesc, dynamicStyles.resultDesc]} numberOfLines={1}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={dynamicStyles.chevronColor} />
        </TouchableOpacity>
    );

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'hotel': return '#e3f2fd'; // Blue
            case 'shop': return '#e8f5e9'; // Green
            case 'place': return '#f3e5f5'; // Purple
            case 'event': return '#fff3e0'; // Orange
            default: return '#f5f5f5'; // Grey
        }
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[styles.header, dynamicStyles.header]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={dynamicStyles.backIconColor} />
                </TouchableOpacity>
                <View style={[styles.searchBar, dynamicStyles.searchBar]}>
                    <Ionicons name="search" size={20} color={dynamicStyles.iconColor} style={{ marginRight: 8 }} />
                    <TextInput
                        style={[styles.input, dynamicStyles.input]}
                        value={queryText}
                        onChangeText={setQueryText}
                        onSubmitEditing={handleSearchSubmit}
                        placeholder="Search Hotel, Places, Events..."
                        placeholderTextColor={isDark ? '#888' : '#999'}
                        autoFocus={!q} // Auto focus if no query passed initially
                    />
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FFD700" />
                </View>
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    contentContainerStyle={styles.listContent}
                    onScrollBeginDrag={Keyboard.dismiss}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <View style={styles.center}>
                            {queryText ? <Text style={dynamicStyles.emptyText}>No results found for "{queryText}"</Text> : <Text style={dynamicStyles.emptyText}>Start searching...</Text>}
                        </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 40,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    listContent: {
        padding: 16,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
        paddingBottom: 16,
    },
    resultImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    resultContent: {
        flex: 1,
        marginRight: 10,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    resultDesc: {
        fontSize: 13,
        color: '#888',
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    badgeText: {
        fontSize: 10,
        color: '#555',
        fontWeight: 'bold',
    },
});
