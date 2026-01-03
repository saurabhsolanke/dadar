import { login } from '@/src/services/auth';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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

            // Try to normalize Firebase error shape
            // Some errors come as { error: { message: 'INVALID_LOGIN_CREDENTIALS', ... } }
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
                <Text style={styles.header}>Welcome Back!</Text>
                <Text style={styles.subHeader}>Sign in to continue</Text>

                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                
                {/* <Text style={styles.forgotPasswordText}>Forgot Password?</Text> */}

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Log In</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToSignUp} style={styles.footerLink}>
                    <Text style={styles.footerText}>Don't have an account? <Text style={styles.linkText}>Sign Up</Text></Text>
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
        flex: 0.4,
        backgroundColor: '#fff', 
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    logo: {
        width: 120,
        height: 120,
    },
    formSection: {
        flex: 0.6,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 30, 
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    forgotPasswordText: {
        textAlign: 'right',
        color: '#666',
        fontSize: 12,
        marginBottom: 20,
    },
    linkText: {
        color: '#007AFF', 
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#FFD700',
        height: 55,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    footerLink: {
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
});

