import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';
import { SymbolView } from 'expo-symbols';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 20,
          right: 20,
          elevation: 4,
          backgroundColor: '#ffffff', // White pill
          borderRadius: 30,
          height: 60,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : null}>
              <SymbolView name={{ ios: 'house.fill', android: 'home', web: 'home' }} size={24} tintColor={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="entrenar"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : null}>
              <SymbolView name={{ ios: 'figure.run', android: 'fitness_center', web: 'fitness_center' }} size={24} tintColor={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="historial"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.centerTab, focused ? styles.activeCenterTab : null]}>
              <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} size={24} tintColor={focused ? '#fff' : '#000'} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="descanso"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : null}>
              <SymbolView name={{ ios: 'map.fill', android: 'map', web: 'map' }} size={24} tintColor={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="ejercicios"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : null}>
              <SymbolView name={{ ios: 'hexagon.fill', android: 'hexagon', web: 'hexagon' }} size={24} tintColor={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: '#000000', // Black background for active tab
    padding: 10,
    borderRadius: 20,
  },
  centerTab: {
    backgroundColor: '#e9d5ff', // Light purple background
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activeCenterTab: {
    backgroundColor: '#a855f7', // Solid purple when active
  }
});
