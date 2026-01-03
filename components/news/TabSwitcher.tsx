import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabSwitcherProps {
    activeTab: 'news' | 'blogs';
    onTabChange: (tab: 'news' | 'blogs') => void;
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'news' && styles.activeTab]}
                onPress={() => onTabChange('news')}
            >
                <Ionicons name="megaphone-outline" size={20} color={activeTab === 'news' ? '#000' : '#666'} style={styles.icon} />
                <Text style={[styles.tabText, activeTab === 'news' && styles.activeTabText]}>
                    News
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'blogs' && styles.activeTab]}
                onPress={() => onTabChange('blogs')}
            >
                <Ionicons name="newspaper-outline" size={20} color={activeTab === 'blogs' ? '#000' : '#666'} style={styles.icon} />
                <Text style={[styles.tabText, activeTab === 'blogs' && styles.activeTabText]}>
                    Blogs
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    tab: {
        paddingVertical: 12,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        marginRight: 4,
    },
    activeTab: {
        borderBottomColor: '#FFD700', // Gold/Yellow color from the screenshot
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
});
