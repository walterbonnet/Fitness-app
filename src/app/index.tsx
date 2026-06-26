import React, { useState, useEffect } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, MaxContentWidth, Spacing, Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MOCK_HISTORY,
  MOCK_EXERCISES,
  WorkoutSession,
  subscribeToHistory,
  getActiveWorkout,
  subscribeToActiveWorkout,
} from '@/constants/mockData';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const brandColors = {
    primary: Colors.light.primary, // Purple
    secondary: Colors.light.secondary, // Black
    accent: Colors.light.accent, // Purple
  };

  const contentPlatformStyle = Platform.select({
    android: { paddingBottom: BottomTabInset + Spacing.four + 60 },
    ios: { paddingBottom: BottomTabInset + Spacing.four + 60 },
    web: { paddingBottom: Spacing.six + 60 }
  });

  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession>(() => getActiveWorkout());
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    const unsubscribeActiveWorkout = subscribeToActiveWorkout((w) => {
      setActiveWorkout(w);
    });
    return () => {
      unsubscribeActiveWorkout();
    };
  }, []);

  const filters = ['Todos', 'Cardio', 'Yoga', 'Fuerza', 'Músculo'];

  // Mock horizontal calendar days
  const calendarDays = [
    { label: 'Dom', date: '13', selected: false },
    { label: 'Lun', date: '14', selected: false },
    { label: 'Mar', date: '15', selected: false },
    { label: 'Mié', date: '16', selected: true },
    { label: 'Jue', date: '17', selected: false },
    { label: 'Vie', date: '18', selected: false },
  ];

  return (
    <View style={styles.container}>
      {/* Background Soft Pastel Gradient */}
      <LinearGradient
        colors={['#e0f2fe', '#f0fdf4', '#fefce8']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerProfile}>
              <View style={[styles.avatar, { backgroundColor: '#e2e8f0' }]}>
                <SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' }} size={20} tintColor="#64748b" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={[styles.timeText, { color: theme.textSecondary }]}>Hola</Text>
                  <SymbolView name={{ ios: 'hand.wave.fill', android: 'waving_hand', web: 'waving_hand' }} size={12} tintColor="#fbbf24" />
                </View>
                <Text style={[styles.welcomeText, { color: theme.text }]}>Walter</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <Pressable style={styles.iconCircle}>
                <SymbolView name={{ ios: 'bell', android: 'notifications', web: 'notifications' }} size={18} tintColor={theme.text} />
              </Pressable>
              <Pressable style={styles.iconCircle}>
                <SymbolView name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }} size={18} tintColor={theme.text} />
              </Pressable>
            </View>
          </View>

          {/* AI Assistant Pill */}
          <View style={styles.aiPillContainer}>
            <View style={styles.aiIconWrapper}>
              <LinearGradient
                colors={['#c084fc', '#9333ea', '#581c87']}
                style={styles.aiSphere}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiPillTitle}>Asistente Fitness IA</Text>
              <Text style={styles.aiPillDesc}>Entrenamientos diarios más inteligentes.</Text>
            </View>
            <View style={styles.aiArrowBtn}>
              <SymbolView name={{ ios: 'arrow.up.right', android: 'north_east', web: 'north_east' }} size={16} tintColor="#000" />
            </View>
          </View>

          {/* Horizontal Calendar */}
          <View style={styles.calendarContainer}>
            {calendarDays.map((day, index) => (
              <View key={index} style={styles.calendarDay}>
                <Text style={[styles.dayLabel, { color: theme.textSecondary }]}>{day.label}</Text>
                {day.selected ? (
                  <View style={styles.dayDateSelectedWrapper}>
                    <View style={styles.dayDateSelectedInner}>
                      <Text style={[styles.dayDate, { color: theme.text, fontWeight: '700' }]}>{day.date}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.dayDateUnselected}>
                    <Text style={[styles.dayDate, { color: theme.text }]}>{day.date}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
            {filters.map((f, i) => (
              <Pressable
                key={i}
                style={[styles.filterChip, activeFilter === f && { backgroundColor: '#000', borderColor: '#000' }]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterText, activeFilter === f ? { color: '#fff' } : { color: theme.textSecondary }]}>
                  {f}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Main Hero Workout Card */}
          <Pressable onPress={() => router.push('/entrenar')} style={styles.heroCardPressable}>
            <View style={styles.heroCardContainer}>
              <View style={styles.heroCardStack1} />
              <View style={styles.heroCardStack2} />

              <View style={styles.heroCard}>
                {/* Hero Background */}
                <Image
                  source={require('@/assets/images/workout_hero.png')}
                  style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                />
                <LinearGradient
                  colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.95)']}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.heroCardTop}>
                  <View style={styles.glassBadge}>
                    <SymbolView name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} size={12} tintColor="#fff" />
                    <Text style={styles.badgeText}>25 min</Text>
                  </View>
                  <View style={styles.glassBadgeIcon}>
                    <SymbolView name={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }} size={14} tintColor="#fff" />
                  </View>
                </View>

                <View style={styles.heroCardBottom}>
                  <View>
                    <Text style={styles.heroCardTitle}>La IA Impulsa</Text>
                    <Text style={styles.heroCardTitle}>Tu Crecimiento</Text>
                    <Text style={styles.heroCardSubtitle}>Crecimiento muscular inteligente.</Text>
                  </View>
                  <View style={styles.heroActionBtn}>
                    <SymbolView name={{ ios: 'arrow.up.right', android: 'north_east', web: 'north_east' }} size={20} tintColor="#000" />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>

        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { flexDirection: 'row', justifyContent: 'center' },
  safeArea: { maxWidth: MaxContentWidth, flexGrow: 1, paddingHorizontal: Spacing.four, gap: Spacing.four, paddingTop: Spacing.three },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.two },
  headerProfile: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  timeText: { fontSize: 12, fontWeight: '600' },
  welcomeText: { fontSize: 20, fontWeight: '800' },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },

  aiPillContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 32, padding: 12, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  aiIconWrapper: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  aiSphere: { width: 40, height: 40, borderRadius: 20 },
  aiPillTitle: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  aiPillDesc: { color: '#64748b', fontSize: 13 },
  aiArrowBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 4 },

  calendarContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: Spacing.one },
  calendarDay: { alignItems: 'center', gap: 8 },
  dayLabel: { fontSize: 13, fontWeight: '600' },
  dayDateSelectedWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#d8b4fe', justifyContent: 'center', alignItems: 'center' },
  dayDateSelectedInner: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  dayDateUnselected: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  dayDate: { fontSize: 16, fontWeight: '600' },

  filtersContainer: { gap: 12, paddingVertical: Spacing.two },
  filterChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  filterText: { fontSize: 14, fontWeight: '700' },

  heroCardPressable: { marginTop: Spacing.two },
  heroCardContainer: { position: 'relative', marginTop: 10 },
  heroCardStack1: { position: 'absolute', top: -10, left: 16, right: 16, height: 40, backgroundColor: '#a7f3d0', borderRadius: 24, opacity: 0.6 },
  heroCardStack2: { position: 'absolute', top: -5, left: 8, right: 8, height: 40, backgroundColor: '#fcd34d', borderRadius: 24, opacity: 0.8 },
  heroCard: { height: 300, borderRadius: 32, overflow: 'hidden', padding: 24, justifyContent: 'space-between', backgroundColor: '#1e293b' },
  heroCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  glassBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  glassBadgeIcon: { backgroundColor: 'rgba(255,255,255,0.15)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },

  heroCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heroCardTitle: { color: '#fff', fontSize: 28, fontWeight: '800', lineHeight: 32 },
  heroCardSubtitle: { color: '#94a3b8', fontSize: 14, fontWeight: '500', marginTop: 8 },
  heroActionBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }
});
