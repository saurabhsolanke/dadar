import BannerCarousel from '@/src/components/BannerCarousel';
import HistoryCard from '@/src/components/HistoryCard';
import HotelCard from '@/src/components/HotelCard';
import NewsCard from '@/src/components/NewsCard';
import { logScreenView } from '@/src/services/logging';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import EventCard from '@/src/components/EventCard';
import { db } from '@/src/config/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

interface HotelItem {
  id: string;
  title: string;
  distance: string;
  rating: number;
  image: { uri: string };
}

interface ShopItem {
  id: string;
  title: string;
  distance: string;
  rating: number;
  image: { uri: string };
}

interface HistoryItem {
  id: string;
  title: string;
  description: string;
  est: string;
  image: { uri: string };
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: { uri: string };
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  organizer: string;
  image: { uri: string };
}

export default function HomeScreen() {
  const router = useRouter();

  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [shops, setShops] = useState<ShopItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const viewportWidth = Dimensions.get('window').width;

  const handleEventScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      setActiveEventIndex(roundIndex);
  };

  useEffect(() => {
    logScreenView('Home_Screen');

    const fetchData = async () => {
      try {
        // Fetch Hotels
        const hotelsQuery = query(collection(db, 'hotels'), limit(5));
        const hotelsSnapshot = await getDocs(hotelsQuery);
        const hotelsList = hotelsSnapshot.docs.map(doc => {
          const data = doc.data();
          const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || 'https://via.placeholder.com/150';
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            distance: data.location || 'Unknown',
            rating: data.rating || 0,
            image: { uri: imageUrl }
          };
        });
        setHotels(hotelsList);

        // Fetch Shops
        const shopsQuery = query(collection(db, 'shops'), limit(5));
        const shopsSnapshot = await getDocs(shopsQuery);
        const shopsList = shopsSnapshot.docs.map(doc => {
          const data = doc.data();
          const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || 'https://via.placeholder.com/150';
          return {
            id: doc.id,
            title: data.name || 'Untitled', // 'name' in db, 'title' in UI
            distance: data.location || 'Unknown',
            rating: data.rating || 0,
            image: { uri: imageUrl }
          };
        });
        setShops(shopsList);

        // Fetch Historical Places
        const historyQuery = query(collection(db, 'places'), limit(5));
        const historySnapshot = await getDocs(historyQuery);
        const historyList = historySnapshot.docs.map(doc => {
            const data = doc.data();
            const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || 'https://via.placeholder.com/150';
            return {
                id: doc.id,
                title: data.title || 'Untitled',
                description: data.description || '',
                est: data.est || data.established || '',
                image: { uri: imageUrl }
            };
        });
        setHistory(historyList);

        // Fetch News
        const newsQuery = query(collection(db, 'news'), limit(5));
        const newsSnapshot = await getDocs(newsQuery);
        const newsList = newsSnapshot.docs.map(doc => {
            const data = doc.data();
            const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || 'https://via.placeholder.com/150';
            return {
                id: doc.id,
                title: data.headline || data.title || 'Untitled',
                content: data.summary || '',
                image: { uri: imageUrl }
            };
        });
        setNews(newsList);

         // Fetch Events
        const eventsQuery = query(collection(db, 'events'), limit(5));
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsList = eventsSnapshot.docs.map(doc => {
            const data = doc.data();
            const imageUrl = data.image || (data.images && data.images.length > 0 ? data.images[0] : null) || 'https://via.placeholder.com/150';
            return {
                id: doc.id,
                title: data.title || 'Untitled',
                description: data.description || '',
                location: data.location || 'Unknown',
                organizer: data.organizer || 'Unknown',
                image: { uri: imageUrl }
            };
        });
        setEvents(eventsList);

      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateToHotel = (id: string, title: string) => {
    router.push({
      pathname: '/hotel/[id]',
      params: { id, title }
    });
  };

   const navigateToShop = (id: string, title: string) => {
    router.push({
      pathname: '/shop/[id]',
      params: { id, title }
    });
  };
   const navigateToPlaces = (id: string, title: string) => {
    router.push({
      pathname: '/place/[id]',
      params: { id, title }
    });
  };
   const navigateToNews = (id: string, title: string) => {
    router.push({
      pathname: '/news/[id]',
      params: { id, title }
    });
  };

  const navigateToEvent = (id: string, title: string) => {
    router.push({
      pathname: '/event/[id]',
      params: { id, title }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchContainer} 
        activeOpacity={1} 
        onPress={() => router.push('/search')}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search Hotel,Places,Events"
          placeholderTextColor="#666"
          editable={false} // Disable typing on home screen
          pointerEvents="none" // Pass touches to parent TouchableOpacity
        />
        <FontAwesome name="search" size={20} color="#000" style={styles.searchIcon} />
      </TouchableOpacity>

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Hotels Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hotel's in Dadar</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ marginLeft: 20 }} />
        ) : (
          hotels.map((item) => (
            <HotelCard
              key={item.id}
              {...item}
              onPress={() => navigateToHotel(item.id, item.title)}
            />
          ))
        )}
      </ScrollView>

      {/* Shops Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Best Shop In Dadar</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ marginLeft: 20 }} />
        ) : (
          shops.map((item) => (
            <HotelCard
              key={item.id}
              {...item}
              onPress={() => navigateToShop(item.id, item.title)}
            />
          ))
        )}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Organise Your Event</Text>
      </View>
      <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            pagingEnabled 
            onScroll={handleEventScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.listContainer}
          >
              {events.map((event, index) => (
                  <EventCard 
                    key={index}
                    title={event.title}
                    description={event.description}
                    image={event.image}
                    width={viewportWidth - 40}
                    onPress={() => navigateToEvent(event.id, event.title)} // Full width minus margins
                  />
              ))}
          </ScrollView>
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
              {events.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                        styles.paginationDot, 
                        activeEventIndex === index ? styles.paginationDotActive : styles.paginationDotInactive
                    ]} 
                  />
              ))}
          </View>
      </View>

      {/* Historical Places Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Historical Places</Text>
        <TouchableOpacity>
           <Text style={{color: '#007AFF', fontWeight: 'bold'}}>Explore All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
          {loading ? (
             <ActivityIndicator size="small" color="#000" style={{ marginLeft: 20 }} />
          ) : (
            history.map((item) => (
                <HistoryCard 
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    est={item.est}
                    image={item.image}
                    onPress={() => navigateToPlaces(item.id, item.title)}
                />
            ))
          )}
      </ScrollView>

      {/* News & Blog Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>News & Blog</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
          {loading ? (
             <ActivityIndicator size="small" color="#000" style={{ marginLeft: 20 }} />
          ) : (
            news.map((item) => (
                <NewsCard 
                    key={item.id}
                    title={item.title}
                    content={item.content}
                    image={item.image}
                    onPress={() => navigateToNews(item.id, item.title)}
                />
            ))
          )}
      </ScrollView>

      {/* Added bottom padding for tab bar */}
      <View style={{ height: 80 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingTop: 20,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: '#000',
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  listContainer: {
    paddingLeft: 20,
    paddingRight: 4, // compensator
    paddingBottom: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  paginationDotActive: {
      backgroundColor: '#FFD700', // Yellow
  },
  paginationDotInactive: {
      backgroundColor: '#ccc', // Grey
  },
});
