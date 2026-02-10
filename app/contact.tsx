import ContactForm from '@/src/components/ContactForm';
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/context/ThemeContext';

export default function ContactScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const dynamicStyles = {
        container: { backgroundColor: isDark ? '#000' : '#f8f8f8' },
        header: { backgroundColor: isDark ? '#000' : '#fff' },
        headerText: { color: isDark ? '#fff' : '#000' },
    };

    return (
        <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>
            <Stack.Screen 
                options={{ 
                    title: 'Contact Us', 
                    headerBackTitle: 'Back',
                    headerStyle: { backgroundColor: isDark ? '#000' : '#fff' },
                    headerTintColor: isDark ? '#fff' : '#000',
                }} 
            />
            <View style={styles.yellowBackground} />
            <View style={{ alignItems: 'flex-end', padding: 10, zIndex: 1 }}>
                {/* <Link href="/login" asChild>
                    <TouchableOpacity style={{ backgroundColor: 'black', padding: 8, borderRadius: 5 }}>
                        <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>Login / Register</Text>
                    </TouchableOpacity>
                </Link> */}
            </View>
            <ContactForm />
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
    yellowBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120, // To mimic the yellow top part behind the card
        backgroundColor: '#FFD700',
    }
});
