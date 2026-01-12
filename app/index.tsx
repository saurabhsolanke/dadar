import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function SplashScreen() {
    const router = useRouter();
    const opacity = useSharedValue(0);
    const { user, loading } = useAuth();

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1000 }, (finished) => {
            // We don't call navigateToLogin here directly anymore
            // We rely on the auth check effect below
        });
    }, []);

    useEffect(() => {
        if (!loading && opacity.value === 1) { 
             // Wait for animation and auth check
             // Added a small delay to ensure the user sees the logo for at least a moment
            const timer = setTimeout(() => {
                if (user) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/login');
                }
            }, 1000); // 1-second delay for better UX
             
            return () => clearTimeout(timer);
        }
    }, [loading, user, opacity.value]); // Re-run when loading status or user changes

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.logoContainer, animatedStyle]}>
                {/* Using the existing splash-icon as the logo source for now */}
                <Image
                    source={require('../assets/images/splash-icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFD700', // Dadar Yellow
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
});
