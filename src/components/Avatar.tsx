import { Image, ImageStyle, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

interface AvatarProps {
    size?: number;
    style?: ImageStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ size = 30, style }) => {
    const { user } = useAuth();
    
    const borderRadius = size / 2;
    const fontSize = size * 0.4;

    if (user?.photoURL) {
        return (
            <Image
                source={{ uri: user.photoURL }}
                style={[{ width: size, height: size, borderRadius }, style]}
            />
        );
    }

    const getInitials = () => {
        if (!user?.displayName) return 'U';
        const names = user.displayName.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return user.displayName[0].toUpperCase();
    };

    return (
        <View style={[
            styles.container, 
            { width: size, height: size, borderRadius },
            style
        ]}>
            <Text style={[styles.text, { fontSize }]}>
                {getInitials()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFD700', // Gold color to match theme
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
    },
});
