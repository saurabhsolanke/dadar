import React from 'react';
import { Image, Platform, Pressable, View } from 'react-native';

export const DadarTabButton = (props: any) => {
    return (
        <Pressable
            {...props}
            onPress={(e) => {
                // Prevent default browser behavior on web (page reload)
                if (Platform.OS === 'web') {
                    e?.preventDefault?.();
                }
                props.onPress?.(e);
            }}
            style={{
                top: -30,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#FFD700', // Yellow Circle
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5,
            }}>
                <Image
                    source={require('../../assets/images/yellow-bglogo.png')}
                    style={{ width: 50, height: 50 }}
                    resizeMode="contain"
                />
            </View>
        </Pressable>
    );
};
