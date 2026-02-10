import FontAwesome from '@expo/vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router'; // Added useRouter
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // Removed Alert
import Toast from 'react-native-toast-message'; // Added Toast
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

import { useTheme } from '../context/ThemeContext';

const ContactForm = () => {
    const router = useRouter(); // Initialize router
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [budget, setBudget] = useState(10000);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        eventDetails: '',
        message: '',
    });

    const dynamicStyles = {
        container: { backgroundColor: isDark ? '#1c1c1e' : 'white' },
        text: { color: isDark ? '#fff' : '#000' },
        label: { color: isDark ? '#ccc' : '#555' },
        input: { 
            backgroundColor: isDark ? '#2c2c2e' : '#fff',
            borderColor: isDark ? '#444' : '#e0e0e0',
            color: isDark ? '#fff' : '#000'
        },
        placeholderText: { color: isDark ? '#888' : '#999' },
        sliderContainer: { borderColor: isDark ? '#444' : '#e0e0e0' },
        divider: { backgroundColor: isDark ? '#333' : '#f0f0f0' },
        footerText: { color: isDark ? '#ccc' : '#333' },
    };

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.message) {
            Toast.show({
                type: 'error',
                text1: 'Missing Details',
                text2: 'Please fill in Name, Email and Message.',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'contact-form'), {
                ...formData,
                budget,
                addedBy: user?.uid || 'guest',
                createdAt: new Date()
            });
            setLoading(false);
            
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Thank you! Your details have been submitted.',
                position: 'top',
                visibilityTime: 3000,
            });

            // Reset form but keep user details if logged in
            setFormData({
                name: user?.displayName || '',
                email: user?.email || '',
                address: '',
                eventDetails: '',
                message: '',
            });
            setBudget(10000);
            
            // Redirect after successful submission
            setTimeout(() => {
                router.back();
            }, 1000); // Small delay to let user see toast

        } catch (error: any) {
            console.error("Error adding document: ", error);
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to submit form. Please try again.',
                position: 'top',
                visibilityTime: 3000,
            });
        }
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Text style={[styles.header, dynamicStyles.text]}>Contact Form</Text>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder="Name"
                    placeholderTextColor={dynamicStyles.placeholderText.color}
                    style={[styles.input, dynamicStyles.input]}
                    value={formData.name}
                    onChangeText={(text) => handleChange('name', text)}
                />
                <TextInput
                    placeholder="Email"
                    placeholderTextColor={dynamicStyles.placeholderText.color}
                    style={[styles.input, dynamicStyles.input]}
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                />
                <TextInput
                    placeholder="Address"
                    placeholderTextColor={dynamicStyles.placeholderText.color}
                    style={[styles.input, dynamicStyles.input]}
                    value={formData.address}
                    onChangeText={(text) => handleChange('address', text)}
                />
                <TextInput
                    placeholder="Event Details"
                    placeholderTextColor={dynamicStyles.placeholderText.color}
                    style={[styles.input, dynamicStyles.input]}
                    value={formData.eventDetails}
                    onChangeText={(text) => handleChange('eventDetails', text)}
                />
            </View>

            <View style={[styles.sliderContainer, dynamicStyles.sliderContainer]}>
                <View style={styles.sliderHeader}>
                    <Text style={[styles.label, dynamicStyles.label]}>Select your budget</Text>
                    <View style={styles.budgetBadge}>
                        <Text style={[styles.budgetText, dynamicStyles.text]}>{budget.toLocaleString()}</Text>
                    </View>
                </View>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={1000}
                    maximumValue={100000}
                    step={1000}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor={isDark ? "#444" : "#d3d3d3"}
                    thumbTintColor="#FFD700"
                    value={budget}
                    onValueChange={setBudget}
                />
            </View>

            <TextInput
                placeholder="Message"
                placeholderTextColor={dynamicStyles.placeholderText.color}
                style={[styles.input, styles.textArea, dynamicStyles.input]}
                multiline
                numberOfLines={4}
                value={formData.message}
                onChangeText={(text) => handleChange('message', text)}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                 {loading ? <ActivityIndicator color="#333" /> : <Text style={styles.buttonText}>Submit</Text>}
            </TouchableOpacity>

            <View style={[styles.divider, dynamicStyles.divider]} />

            <View style={styles.footer}>
                <View>
                    <Text style={[styles.footerText, dynamicStyles.footerText]}>+9898478899</Text>
                    <Text style={[styles.footerText, dynamicStyles.footerText]}>Dadar@gmail.com</Text>
                </View>
                <View style={styles.socialIcons}>
                    <FontAwesome name="google" size={24} color="#DB4437" style={styles.icon} />
                    <FontAwesome name="instagram" size={24} color="#C13584" style={styles.icon} />
                    <FontAwesome name="facebook" size={24} color="#4267B2" style={styles.icon} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        margin: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    sliderContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 25,
        padding: 15,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    budgetBadge: {
        borderWidth: 1,
        borderColor: '#FFD700',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    budgetText: {
        fontWeight: 'bold',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top', // Android fix
        borderRadius: 15,
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        color: '#333',
        marginBottom: 5,
    },
    socialIcons: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 15,
    }
});

export default ContactForm;
