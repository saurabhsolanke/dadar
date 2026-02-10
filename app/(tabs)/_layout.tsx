import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { AppHeaderLeft } from '@/src/components/AppHeaderLeft';
import { AppHeaderRight } from '@/src/components/AppHeaderRight';
import { DadarTabButton } from '@/src/components/DadarTabButton';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700', // Yellow tint
        tabBarInactiveTintColor: '#000',
        headerShown: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: 'Welcome To Dadar',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20
          },
          headerRight: () => <AppHeaderRight />,
        }}
      />
      <Tabs.Screen
        name="hotels"
        options={{
          title: 'Hotels',
          tabBarIcon: ({ color }) => <TabBarIcon name="hotel" color={color} />,
        }}
      />

      {/* Center Custom Button */}
      <Tabs.Screen
        name="dadar"
        options={{
          headerTitle: 'Dadar',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          headerLeft: () => <AppHeaderLeft />,
          headerRight: () => <AppHeaderRight />,
          title: '',
          tabBarIcon: () => null, // Hide default icon
          tabBarButton: (props) => <DadarTabButton {...props} />,
        }}
      />
     <Tabs.Screen
        name="places"
        options={{
          title: 'Places',
          tabBarIcon: ({ color }) => <TabBarIcon name="building" color={color} />,
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: 'Event',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />

    </Tabs>
  );
}
