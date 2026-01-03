import { uploadImageToCloudinary } from '@/src/services/cloudinary';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { updateEmail, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/hooks/useAuth';

const AVATARS = [
    'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
    'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436190.jpg',
    'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
    'https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg',
    'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg',
    'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg',
    'https://img.freepik.com/free-psd/3d-illustration-business-man-with-glasses_23-2149436194.jpg',
    'https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2149436186.jpg',
];

import { Modal } from 'react-native';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, loading } = useAuth();
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setPhone(user.phoneNumber || ''); 
            setEmail(user.email || '');
            setImage(user.photoURL);
        }
    }, [user]);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => { // Modified to use Cloudinary
        try {
            // If it's one of our preset avatars, return URL directly
            if (AVATARS.includes(uri)) return uri;

            const url = await uploadImageToCloudinary(uri);
            if (!url) throw new Error("Failed to upload image to Cloudinary");
            return url;
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            let photoURL = user.photoURL;

            if (image && image !== user.photoURL) {
                photoURL = await uploadImage(image);
            }

            await updateProfile(user, {
                displayName: name,
                photoURL: photoURL
            });
            
            if (email !== user.email && email) {
                try {
                    await updateEmail(user, email);
                } catch (e: any) {
                     Alert.alert("Error updating email", e.message);
                }
            }

            Alert.alert("Success", "Profile updated successfully!");
            router.back();
        } catch (error: any) {
             Alert.alert("Error", error.message);
        } finally {
            setSaving(false);
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
             <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Please login to edit your profile.</Text>
            </View>
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
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <View style={{ width: 24 }} /> {/* Spacer for centering */}
                </View>
            </View>

            {/* Main Card */}
            <View style={styles.card}>
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={() => setShowAvatarModal(true)} style={styles.avatarWrapper}>
                        <Image 
                            source={{ uri: image || 'https://via.placeholder.com/150' }} 
                            style={styles.avatar} 
                        />
                        <View style={styles.cameraIcon}>
                            <Ionicons name="camera" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowAvatarModal(true)}>
                        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Avatar Selection Modal */}
                <Modal
                    visible={showAvatarModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowAvatarModal(false)}
                >
                     <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Choose Avatar</Text>
                                <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                                    <Ionicons name="close" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            
                            <ScrollView contentContainerStyle={styles.avatarGrid}>
                                {AVATARS.map((avatarUrl, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        onPress={() => {
                                            setImage(avatarUrl);
                                            setShowAvatarModal(false);
                                        }}
                                        style={[
                                            styles.gridAvatarItem, 
                                            image === avatarUrl && styles.selectedAvatar
                                        ]}
                                    >
                                        <Image source={{ uri: avatarUrl }} style={styles.gridAvatarImage} />
                                    </TouchableOpacity>
                                ))}
                                {/* Option to pick from gallery */}
                                <TouchableOpacity 
                                    onPress={() => {
                                        pickImage();
                                        setShowAvatarModal(false);
                                    }}
                                    style={styles.gridAvatarItem}
                                >
                                    <View style={[styles.gridAvatarImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                                         <Ionicons name="image" size={30} color="#666" />
                                         <Text style={{fontSize: 10, color: '#666'}}>Gallery</Text>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Text style={styles.userName}>{user.displayName || 'User'}</Text>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Form Fields */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input} 
                            value={name}
                            onChangeText={setName}
                            placeholder="Name"
                        />
                        <Ionicons name="pencil" size={20} color="black" />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input} 
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Phone (Read only)"
                            keyboardType="phone-pad"
                            editable={false} 
                        />
                        <Ionicons name="lock-closed-outline" size={20} color="gray" />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input} 
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                        />
                        <Ionicons name="pencil" size={20} color="black" />
                    </View>
                </View>

                {/* Continue Button */}
                <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
                    {saving ? (
                         <ActivityIndicator color="black" />
                    ) : (
                        <Text style={styles.buttonText}>Continue</Text>
                    )}
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
        marginBottom: 15,
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
    cameraIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 8,
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
        marginBottom: 20,
    },
    form: {
        width: '100%',
        gap: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: 'black',
    },
    button: {
        backgroundColor: '#FFD700',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
    changePhotoText: {
        color: '#FFD700',
        marginTop: 10,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    gridAvatarItem: {
        width: '30%',
        aspectRatio: 1,
        marginBottom: 15,
        borderRadius: 50,
        padding: 2,
    },
    selectedAvatar: {
        borderWidth: 3,
        borderColor: '#FFD700',
    },
    gridAvatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
});
