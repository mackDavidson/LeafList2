import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="addPlantPop" />
      <Stack.Screen name="profiles/[id]" options={{title : "Plant Profile"}} />
      <Stack.Screen name="editPlantProfile" options={{ title: 'Edit Plant Profile' }} />
      <Stack.Screen name="addLocationPop" options={{ title: 'Add Location' }} />
      <Stack.Screen name="addSpeciesPop" options={{ title: 'Add Species' }} />
    </Stack>
  );
}