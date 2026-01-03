/**
 * Uploads an image to Cloudinary
 * @param {string} imageUri - The local URI of the image to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */

export const uploadImageToCloudinary = async (imageUri: string): Promise<string | null> => {
    try {
        if (!imageUri) return null;

        // Create a form data object
        const formData = new FormData();
        
        // Append the file
        // Note: The 'uri' must be valid. Typescript might complain about the specialized object structure needed for React Native, hence the 'any' or specific casting.
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('file', { uri: imageUri, name: filename, type } as any);
        
        // Add your upload preset and cloud name here
        // IMPORTANT: In production, these should be environment variables
        const UPLOAD_PRESET = 'dadar_app_preset'; // Replace with your actual upload preset
        const CLOUD_NAME = 'dirarq6it'; // Replace with your actual cloud name
        
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('cloud_name', CLOUD_NAME);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            console.error("Cloudinary upload failed:", data);
            return null;
        }
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};
