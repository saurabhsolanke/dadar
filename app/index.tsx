import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const LOGO_SIZE = width * 0.55;

export default function AppSplashScreen() {
    const router = useRouter();

    // Animation values
    const logoScale = useSharedValue(0.3);
    const logoOpacity = useSharedValue(0);
    const bgOpacity = useSharedValue(0);
    const screenOpacity = useSharedValue(1);

    const navigateToHome = () => {
        router.replace('/(tabs)');
    };

    useEffect(() => {
        // Hide the native Expo splash screen immediately — our custom one takes over
        SplashScreen.hideAsync();

        // Sequence:
        // 1. Fade in background (instant)
        // 2. Scale + fade in logo (spring animation — feels alive)
        // 3. Brief hold
        // 4. Fade out entire screen
        // 5. Navigate to Home

        bgOpacity.value = withTiming(1, { duration: 150 });

        logoOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));

        logoScale.value = withDelay(
            200,
            withSequence(
                withSpring(1.08, { damping: 10, stiffness: 120 }),
                withSpring(1.0, { damping: 14, stiffness: 200 })
            )
        );

        // After the logo has settled (~2s total), fade out & navigate
        const timer = setTimeout(() => {
            screenOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
                if (finished) {
                    runOnJS(navigateToHome)();
                }
            });
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    const bgStyle = useAnimatedStyle(() => ({
        opacity: bgOpacity.value,
    }));

    const logoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const screenStyle = useAnimatedStyle(() => ({
        opacity: screenOpacity.value,
    }));

    return (
        <Animated.View style={[styles.screen, screenStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.background, bgStyle]} />
            <View style={styles.content}>
                <Animated.View style={[styles.logoWrap, logoStyle]}>
                    <Image
                        source={require('../assets/images/yellow-bglogo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFD700',
    },
    background: {
        backgroundColor: '#FFD700',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        // Subtle shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    logo: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        borderRadius: LOGO_SIZE / 2,
    },
});
