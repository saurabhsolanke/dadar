import { uploadImageToCloudinary } from '@/src/services/cloudinary';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { db } from '../src/config/firebase';
import { useAuth } from '../src/hooks/useAuth';

export default function WriteExperienceScreen() {
    const router = useRouter();
    const { user } = useAuth();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in both title and content.',
            });
            return;
        }

        if (!user) {
            Toast.show({
                type: 'error',
                text1: 'Authentication Required',
                text2: 'You must be logged in to post.',
            });
            return;
        }

        setSubmitting(true);
        try {
            let imageUrl = null;
            if (image) {
                imageUrl = await uploadImageToCloudinary(image);
            }

            await addDoc(collection(db, 'experience'), {
                title: title,
                description: content,
                image: imageUrl,
                author: user.displayName || 'Anonymous',
                authorId: user.uid,
                type: 'experience',
                createdAt: serverTimestamp(),
            });

            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Your experience has been published.',
            });
            
            router.push('/dadar');
        } catch (error: any) {
            console.error("Error posting experience:", error);
            Toast.show({
                type: 'error',
                text1: 'Submission Failed',
                text2: 'Failed to post experience. Please try again.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Write Experience</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Title Input */}
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Give a title to your experience..."
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                />

                {/* Content Input */}
                <Text style={styles.label}>Your Story</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Share your thoughts..."
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />

                {/* Image Picker */}
                <Text style={styles.label}>Add Photo</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="camera-outline" size={40} color="#666" />
                            <Text style={styles.imagePlaceholderText}>Tap to select image</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {image && (
                    <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImage}>
                        <Text style={styles.removeImageText}>Remove Image</Text>
                    </TouchableOpacity>
                )}

                {/* Submit Button */}
                <TouchableOpacity 
                    style={[styles.submitButton, submitting && styles.disabledButton]} 
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text style={styles.submitButtonText}>Publish</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    textArea: {
        height: 150,
        paddingTop: 15,
    },
    imagePicker: {
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    imagePlaceholder: {
        height: 200,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        marginTop: 10,
        color: '#666',
    },
    previewImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    removeImage: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    removeImageText: {
        color: 'red',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#FFD700',
        padding: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
});
