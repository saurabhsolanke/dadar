import { register } from '@/src/services/auth';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        if (!name || name.length < 2) {
             Toast.show({
                type: 'error',
                text1: 'Invalid Details',
                text2: 'Please enter a valid name.',
             });
             return;
        }
        if (!email || !email.includes('@')) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Details',
                text2: 'Please enter a valid email.',
             });
             return;
        }
        if (password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Details',
                text2: 'Password must be at least 6 characters.',
             });
             return;
        }
        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Details',
                text2: 'Passwords do not match.',
             });
             return;
        }

        setLoading(true);
        try {
            await register(email, password, name);
             setLoading(false);
             Toast.show({
                type: 'success',
                text1: 'Account created successfully!',
                text2: 'Welcome to the app!',
             });
             router.replace('/(tabs)'); // Go to home after signup

        } catch (error: any) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: error.message,
             });
        }
    };

    const navigateToLogin = () => {
        router.back();
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Sign Up', headerShown: false }} />

                <View style={styles.logoSection}>
                    <Image
                        source={require('../assets/images/yellow-bglogo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.header}>Create your account</Text>

                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                    </TouchableOpacity>

                   {/*
                    <Text style={styles.orText}>-Or Sign in with-</Text>
                     <View style={styles.socialContainer}>
                    </View>
                    */}

                    <TouchableOpacity onPress={navigateToLogin} style={styles.footerLink}>
                        <Text style={styles.footerText}>Already have an account? <Text style={styles.linkText}>Log In</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoSection: {
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    logo: {
        width: 120,
        height: 120,
    },
    formSection: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#000',
    },
    inputGroup: {
        marginBottom: 15,
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: '#ddd', 
        borderRadius: 30,
        paddingHorizontal: 20,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#FFD700',
        height: 55,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    orText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        marginBottom: 20,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    footerLink: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    linkText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});
