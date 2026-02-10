import { Platform } from 'react-native';

/**
 * Uploads an image to Cloudinary using expo-file-system (Native) or fetch (Web)
 * @param {string} imageUri - The local URI of the image to upload
 * @returns {Promise<string | null>} - The secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (imageUri: string): Promise<string | null> => {
    try {
        if (!imageUri) return null;

        // Constants from environment variables
        const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
        const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dirarq6it';

        if (!process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
            console.warn('[Cloudinary] EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set in .env. Using default.');
        }

        const API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        console.log(`[Cloudinary] Starting upload for ${imageUri} to cloud: ${CLOUD_NAME} with preset: ${UPLOAD_PRESET}...`);

        if (Platform.OS === 'web') {
            // Web implementation using fetch
            // Convert blob URI to Blob if necessary, though fetch handles many cases automatically
            let fileToUpload: any = imageUri;

            // If it's a blob: URL (common in Expo Web), we usually need to convert it to a Blob object for FormData
            if (typeof imageUri === 'string' && (imageUri.startsWith('blob:') || imageUri.startsWith('file:'))) {
                const response = await fetch(imageUri);
                fileToUpload = await response.blob();
            }

            const formDataWeb = new FormData();
            formDataWeb.append('file', fileToUpload);
            formDataWeb.append('upload_preset', UPLOAD_PRESET);
            formDataWeb.append('cloud_name', CLOUD_NAME);

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formDataWeb,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[Cloudinary] Web Upload failed:", errorData);
                return null;
            }

            const data = await response.json();
            if (data.secure_url) {
                console.log("[Cloudinary] Web Upload success:", data.secure_url);
                return data.secure_url;
            } else {
                console.error("[Cloudinary] Web Upload failed (no secure_url):", data);
                return null;
            }

        } else {
            // Native implementation using expo-file-system/legacy
            // Using require to allow web to bundle this file without crashing on missing native module
            const { uploadAsync, FileSystemUploadType } = require('expo-file-system/legacy');

            const uploadResult = await uploadAsync(API_URL, imageUri, {
                httpMethod: 'POST',
                uploadType: FileSystemUploadType.MULTIPART,
                fieldName: 'file',
                parameters: {
                    'upload_preset': UPLOAD_PRESET,
                    'cloud_name': CLOUD_NAME
                },
            });

            console.log(`[Cloudinary] Status: ${uploadResult.status}`);

            if (uploadResult.status !== 200) {
                console.error("[Cloudinary] Upload failed:", uploadResult.body);
                return null;
            }

            const data = JSON.parse(uploadResult.body);

            if (data.secure_url) {
                console.log("[Cloudinary] Upload success:", data.secure_url);
                return data.secure_url;
            } else {
                console.error("[Cloudinary] No secure_url in response:", data);
                return null;
            }
        }

    } catch (error) {
        console.error("[Cloudinary] Error uploading image:", error);
        return null;
    }
};
