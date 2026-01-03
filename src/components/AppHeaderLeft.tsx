import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export const AppHeaderLeft = () => {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
    );
};
