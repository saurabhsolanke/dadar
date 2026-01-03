import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../src/hooks/useAuth';
import { logout } from '../src/services/auth';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const menuItems = [
        { icon: 'person-outline', label: 'My Profile', route: '/edit-profile' },
        { icon: 'calendar-outline', label: 'My Book events', route: '/events' }, // Assuming events route or placeholder
        { icon: 'notifications-outline', label: 'Notification', route: '/notifications' },
        { icon: 'call-outline', label: 'Contact us', route: '/contact' },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            Toast.show({
                type: 'success',
                text1: 'Logged out successfully',
            });
            router.replace('/'); // Redirect to home or login page after logout
        } catch (error: any) {
            console.error("Logout failed", error);
            Toast.show({
                type: 'error',
                text1: 'Logout failed',
                text2: error.message || 'Please try again',
            });
        }
    };

    if (loading) {
        return (
             <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (!user) {
         return (
             <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.headerBackground}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                         <Text style={styles.headerTitle}>Profile</Text>
                         <View style={{ width: 24 }} />
                    </View>
                </View>

                 <View style={styles.card}>
                     <Text style={styles.userName}>Guest User</Text>
                     <Text style={{ textAlign: 'center', marginBottom: 20, color: 'gray' }}>Please login to view your profile.</Text>
                      {/* Add Login Button or Link here if you have a dedicated login page */}
                 </View>
             </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header Background */}
            <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={{ width: 24 }} />
                </View>
            </View>

            {/* Main Card */}
            <View style={styles.card}>
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarWrapper}>
                        <Image 
                            source={{ uri: user.photoURL || '' }} 
                            style={styles.avatar} 
                        />
                         <Link href="/edit-profile" asChild>
                            <TouchableOpacity style={styles.editIconBadge}>
                                <Ionicons name="pencil" size={16} color="black" />
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                {/* Display Name or Fallback */}
                <Text style={styles.userName}>{user.displayName || user.phoneNumber || user.email || 'User'}</Text>
                 {/* Display Email/Phone if available and different from display name logic above, 
                 or just keep it simple. Often good to show at least one identifier beneath name if name is set. */}
                 {(user.email && user.displayName) && <Text style={styles.userSubText}>{user.email}</Text>}
                 {(user.phoneNumber && user.displayName) && <Text style={styles.userSubText}>{user.phoneNumber}</Text>}


                {/* Divider */}
                <View style={styles.divider} />

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <Link key={index} href={item.route as any} asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <View style={styles.menuItemLeft}>
                                    <Ionicons name={item.icon as any} size={24} color="black" />
                                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                                </View>
                            </TouchableOpacity>
                        </Link>
                    ))}
                </View>
            </View>

             {/* Logout Button */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    content: {
        paddingBottom: 40,
    },
    headerBackground: {
        backgroundColor: '#FFD700',
        height: 200,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 15,
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginTop: -60, // Overlap the header
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: -80, // Pull avatar up
        marginBottom: 10,
    },
    avatarWrapper: {
        position: 'relative',
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 75,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#FFD700',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#FFD700',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5,
    },
    userSubText: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
        marginBottom: 20,
    },
    menuContainer: {
        width: '100%',
        gap: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    menuItemLabel: {
        fontSize: 16,
        color: 'black',
    },
    logoutContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoutText: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '500',
    },
});
