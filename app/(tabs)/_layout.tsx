import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: 'green'}}>
      <Tabs.Screen name="index" options={{title: 'Indoor Collection', 
        tabBarIcon: ({color}) => <MaterialCommunityIcons size ={30} name='watering-can' color={color}/>,}} />
      <Tabs.Screen name="outdoor" options={{title: 'Outdoor Collection', 
        tabBarIcon: ({color}) => <MaterialCommunityIcons size ={30} name='bee-flower' color={color}/>,}} />
    </Tabs>
  );
}