import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Avatar } from './Avatar';

export const AppHeaderRight = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, gap: 15 }}>
            <Link href="/notifications" asChild>
                <Pressable>
                    {({ pressed }) => (
                        <FontAwesome
                            name="bell"
                            size={20}
                            color="black"
                            style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable>
            </Link>
            <Link href="/profile" asChild>
                <Pressable>
                    {({ pressed }) => (
                        <Avatar
                            size={30}
                            style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable>
            </Link>
        </View>
    );
};
