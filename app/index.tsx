import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function SplashScreen() {
    const router = useRouter();
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1000 }, (finished) => {
            if (finished) {
                runOnJS(navigateToLogin)();
            }
        });
    }, []);

    const navigateToLogin = () => {
        // Delay slightly to let the user see the logo, then navigate
        setTimeout(() => {
            router.replace('/login');
        }, 1500);
    };

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
