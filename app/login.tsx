import { login } from '@/src/services/auth';
import { handleFacebookSignIn, handleGoogleSignIn, handleInstagramSignIn, useFacebookAuth, useGoogleAuth, useInstagramAuth } from '@/src/services/sso';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [googleRequest, googleResponse, googlePromptAsync] = useGoogleAuth();
    const [fbRequest, fbResponse, fbPromptAsync] = useFacebookAuth();
    const [instaRequest, instaResponse, instaPromptAsync] = useInstagramAuth();

    useEffect(() => {
        if (googleResponse?.type === 'success') {
            setLoading(true);
            handleGoogleSignIn(googleResponse)
                .then(() => {
                    setLoading(false);
                    router.replace('/(tabs)');
                })
                .catch((err) => {
                    setLoading(false);
                    Toast.show({ type: 'error', text1: 'Google Login Failed', text2: err.message });
                });
        }
    }, [googleResponse]);

    useEffect(() => {
        if (fbResponse?.type === 'success') {
            setLoading(true);
            handleFacebookSignIn(fbResponse)
                .then(() => {
                    setLoading(false);
                    router.replace('/(tabs)');
                })
                .catch((err) => {
                    setLoading(false);
                    Toast.show({ type: 'error', text1: 'Facebook Login Failed', text2: err.message });
                });
        }
    }, [fbResponse]);

    useEffect(() => {
        if (instaResponse?.type === 'success') {
            setLoading(true);
            handleInstagramSignIn(instaResponse)
                .catch((err) => {
                    setLoading(false);
                    Toast.show({ type: 'error', text1: 'Instagram Login Failed', text2: err.message });
                });
        }
    }, [instaResponse]);

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Details',
                text2: 'Please enter both email and password.',
            });
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            setLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'Welcome back!',
            });
            router.replace('/(tabs)');

        } catch (error: any) {
            setLoading(false);

            const rawMessage =
                error?.error?.message ||
                error?.message ||
                error?.code ||
                '';

            let friendlyMessage = 'An error occurred during login. Please try again.';

            if (typeof rawMessage === 'string' && rawMessage.includes('INVALID_LOGIN_CREDENTIALS')) {
                friendlyMessage = 'Invalid email or password. Please try again.';
            } else if (typeof rawMessage === 'string' && rawMessage.trim().length > 0) {
                friendlyMessage = rawMessage;
            }

            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: friendlyMessage,
            });
        }
    };

    const navigateToSignUp = () => {
        router.push('/signup');
    };

    const isGoogleConfigured = !!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
    const isFacebookConfigured = !!process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
    const isInstagramConfigured = !!process.env.EXPO_PUBLIC_INSTAGRAM_CLIENT_ID;

    const handleGoogleLogin = () => {
        if (!isGoogleConfigured) {
            Toast.show({ type: 'error', text1: 'Configuration Missing', text2: 'Google Client ID is not set in .env' });
            return;
        }
        googlePromptAsync();
    };

    const handleInstagramLogin = () => {
        if (!isInstagramConfigured) {
            Toast.show({ type: 'error', text1: 'Configuration Missing', text2: 'Instagram Client ID is not set in .env' });
            return;
        }
        instaPromptAsync();
    };

    const handleFacebookLogin = () => {
        if (!isFacebookConfigured) {
            Toast.show({ type: 'error', text1: 'Configuration Missing', text2: 'Facebook App ID is not set in .env' });
            return;
        }
        fbPromptAsync();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.logoSection}>
                <Image
                    source={require('../assets/images/yellow-bglogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.formSection}>
                <Text style={styles.header}>Login to your account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter you phone number or email id"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Continue</Text>}
                </TouchableOpacity>

                <View style={styles.dividerSection}>
                    <Text style={styles.dividerText}>-Or Sign in with-</Text>
                </View>

                <View style={styles.ssoSection}>
                    <TouchableOpacity 
                        style={styles.ssoButton} 
                        onPress={handleGoogleLogin}
                        disabled={!googleRequest || loading}
                    >
                        <AntDesign name="google" size={24} color="#4285F4" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.ssoButton} 
                        onPress={handleInstagramLogin}
                        disabled={!instaRequest || loading}
                    >
                        <AntDesign name="instagram" size={24} color="#E4405F" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.ssoButton} 
                        onPress={handleFacebookLogin}
                        disabled={!fbRequest || loading}
                    >
                        <FontAwesome name="facebook" size={24} color="#1877F2" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={navigateToSignUp} style={styles.footerLink}>
                    <Text style={styles.footerText}>Don't have an account? <Text style={styles.linkText}>Sign up</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoSection: {
        flex: 0.35,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    logo: {
        width: 140,
        height: 140,
    },
    formSection: {
        flex: 0.65,
        paddingHorizontal: 28,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#000',
        textAlign: 'left',
    },
    input: {
        height: 55,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        borderRadius: 30,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#F6F6F6',
        color: '#000',
    },
    button: {
        backgroundColor: '#FFD700',
        height: 55,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 35,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    dividerSection: {
        alignItems: 'center',
        marginBottom: 25,
    },
    dividerText: {
        color: '#A1A1A1',
        fontSize: 14,
    },
    ssoSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 50,
    },
    ssoButton: {
        width: 65,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 2,
    },
    footerLink: {
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#A1A1A1',
    },
    linkText: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
});

