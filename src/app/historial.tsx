import React, { useState, useEffect } from 'react';
import { 
  Platform, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { MOCK_HISTORY, WorkoutSession, subscribeToHistory } from '@/constants/mockData';

export default function HistoryScreen() {
  const theme = useTheme();
  const { horizontalPadding } = useResponsive();
  
  // Design colors
  const brandColors = {
    primary: '#A3E635', // Neon Green
    secondary: '#00F0FF', // Cyan
    accent: '#A855F7', // Purple
    warning: '#FF6B6B', // Coral
    cardBg: '#1C1C1E',
  };

  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
  const [history, setHistory] = useState<WorkoutSession[]>(MOCK_HISTORY);

  useEffect(() => {
    // Subscribe to history updates
    const unsubscribe = subscribeToHistory((newHistory) => {
      setHistory(newHistory);
    });
    return unsubscribe;
  }, []);

  const contentPlatformStyle = Platform.select({
    android: {
      paddingBottom: BottomTabInset + Spacing.four,
    },
    ios: {
      paddingBottom: BottomTabInset + Spacing.four,
    },
    web: {
      paddingBottom: Spacing.six,
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, contentPlatformStyle]}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={[styles.safeArea, { paddingHorizontal: horizontalPadding }]} edges={['top', 'left', 'right']}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Historial</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Tus entrenamientos anteriores
            </Text>
          </View>

          {/* History List / Empty State */}
          {history.length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
              <View style={styles.emptyIconCircle}>
                <SymbolView 
                  name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }} 
                  size={40} 
                  tintColor={brandColors.secondary} 
                />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Historial Vacío</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Aún no has guardado ningún entrenamiento. Completa tu primer entrenamiento en la sección "Entrenar" para verlo aquí.
              </Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {history.map((session) => (
                <Pressable 
                  key={session.id} 
                  style={({ pressed }) => [
                    styles.sessionCard, 
                    { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                    pressed && styles.pressed
                  ]}
                  onPress={() => setSelectedSession(session)}
                >
                  <View style={styles.sessionCardHeader}>
                    <View style={styles.titleWrapper}>
                      <Text style={[styles.sessionTitle, { color: theme.text }]}>{session.title}</Text>
                      <Text style={[styles.sessionDate, { color: theme.textSecondary }]}>{session.date}</Text>
                    </View>
                    <SymbolView 
                      name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} 
                      size={16} 
                      tintColor={theme.textSecondary} 
                    />
                  </View>

                  {/* Quick Info Grid */}
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <SymbolView 
                        name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} 
                        size={12} 
                        tintColor={brandColors.secondary} 
                      />
                      <Text style={[styles.infoVal, { color: theme.text }]}>{session.durationMinutes} min</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <SymbolView 
                        name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }} 
                        size={12} 
                        tintColor={brandColors.primary} 
                      />
                      <Text style={[styles.infoVal, { color: theme.text }]}>{session.volumeKg} kg</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <SymbolView 
                        name={{ ios: 'list.bullet', android: 'list', web: 'list' }} 
                        size={12} 
                        tintColor={brandColors.accent} 
                      />
                      <Text style={[styles.infoVal, { color: theme.text }]}>{session.exercisesCount} ejer.</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </SafeAreaView>
      </ScrollView>

      {/* Visual Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedSession !== null}
        onRequestClose={() => setSelectedSession(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundElement }]}>
            {selectedSession && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedSession.title}</Text>
                    <Text style={[styles.modalDate, { color: theme.textSecondary }]}>{selectedSession.date}</Text>
                  </View>
                  <Pressable 
                    onPress={() => setSelectedSession(null)}
                    style={({ pressed }) => [styles.closeIcon, pressed && styles.pressed]}
                  >
                    <SymbolView 
                      name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }} 
                      size={24} 
                      tintColor={theme.textSecondary} 
                    />
                  </Pressable>
                </View>

                <ScrollView 
                  style={styles.modalScrollView} 
                  showsVerticalScrollIndicator={false}
                >
                  {/* Workout Stats Overview */}
                  <View style={[styles.statsRow, { backgroundColor: theme.backgroundSelected }]}>
                    <View style={styles.statBox}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {selectedSession.durationMinutes} min
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Duración</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {selectedSession.volumeKg} kg
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Volumen</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statValue, { color: theme.text }]}>
                        {selectedSession.exercises.reduce((acc, curr) => acc + curr.sets.length, 0)}
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Series</Text>
                    </View>
                  </View>

                  {/* Exercises Details */}
                  <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Detalle del Entrenamiento</Text>
                  
                  {selectedSession.exercises.map((exercise, index) => (
                    <View key={index} style={styles.modalExerciseItem}>
                      <View style={styles.modalExerciseTitleRow}>
                        <Text style={[styles.modalExerciseName, { color: theme.text }]}>
                          {exercise.name}
                        </Text>
                        <Text style={[styles.modalExerciseMuscle, { color: brandColors.secondary }]}>
                          {exercise.muscleGroup}
                        </Text>
                      </View>
                      
                      {/* Sets list */}
                      <View style={styles.setsList}>
                        {exercise.sets.map((set, sIndex) => (
                          <View key={sIndex} style={styles.modalSetRow}>
                            <Text style={[styles.modalSetNum, { color: brandColors.primary }]}>
                              S{set.setNumber}
                            </Text>
                            <Text style={[styles.modalSetInfo, { color: theme.text }]}>
                              {set.weight} kg  ×  {set.reps} reps
                            </Text>
                            <View style={styles.setBarContainer}>
                              {/* Visual performance bar representation based on weight */}
                              <View style={[
                                styles.setBar, 
                                { 
                                  width: `${Math.min(100, (set.weight / 150) * 100)}%`,
                                  backgroundColor: brandColors.primary 
                                }
                              ]} />
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
    paddingTop: Spacing.three,
  },
  header: {
    paddingVertical: Spacing.two,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: Spacing.half,
  },
  listContainer: {
    gap: Spacing.three,
  },
  sessionCard: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sessionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrapper: {
    gap: Spacing.half,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sessionDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.one,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: Spacing.two,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    padding: Spacing.four,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: Spacing.two,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalDate: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: Spacing.half,
  },
  closeIcon: {
    padding: Spacing.one,
  },
  modalScrollView: {
    marginVertical: Spacing.two,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginBottom: Spacing.three,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  modalExerciseItem: {
    marginBottom: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  modalExerciseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  modalExerciseName: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  modalExerciseMuscle: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: Spacing.two,
  },
  setsList: {
    gap: Spacing.one,
  },
  modalSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.half,
  },
  modalSetNum: {
    fontSize: 12,
    fontWeight: '800',
    width: 30,
  },
  modalSetInfo: {
    fontSize: 13,
    fontWeight: '600',
    width: 120,
  },
  setBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    marginLeft: Spacing.two,
    overflow: 'hidden',
  },
  setBar: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.four,
  },
});

