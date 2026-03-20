
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { AppHeaderRight } from '@/src/components/AppHeaderRight';
import { DadarTabButton } from '@/src/components/DadarTabButton'; // Commented out as the custom button is not currently used

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
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#ccc' : '#000',
        headerShown: true,
        headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerTintColor: colorScheme === 'dark' ? '#FFD700' : '#000',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          borderTopColor: colorScheme === 'dark' ? '#333' : '#eee', // Optional: separator
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
            fontSize: 20,
            color: colorScheme === 'dark' ? '#FFD700' : '#000',
          },
          headerRight: () => <AppHeaderRight />,
        }}
      />
      <Tabs.Screen
        name="hotels"
        options={{
          title: 'Hotels',
          tabBarIcon: ({ color }) => <TabBarIcon name="hotel" color={color} />,
          headerRight: () => <AppHeaderRight />,
        }}
      />

       <Tabs.Screen
        name="dadar"
        options={{
          headerTitle: 'Dadar',
          headerShadowVisible: false,
          headerRight: () => <AppHeaderRight />,
          title: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => <DadarTabButton {...props} />,
        }}
      /> 

      {/* Center Custom Button */}
      {/* <Tabs.Screen
        name="dadar"
        options={{
          headerTitle: 'Dadar',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#FFD700' : '#000',
          },
          headerShadowVisible: false,
          headerLeft: () => <AppHeaderLeft />,
          headerRight: () => <AppHeaderRight />,
          title: '',
          tabBarIcon: () => null, // Hide default icon
          tabBarButton: (props) => <DadarTabButton {...props} />,
        }}
      /> */}

     <Tabs.Screen
        name="places"
        options={{
          title: 'Places',
          tabBarIcon: ({ color }) => <TabBarIcon name="building" color={color} />,
          headerRight: () => <AppHeaderRight />,
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: 'Event',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerRight: () => <AppHeaderRight />,
        }}
      />

    </Tabs>
  );
}
