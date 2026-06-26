import React, { useState, useEffect } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Modal, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, MaxContentWidth, Spacing, Colors, Layout } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MOCK_EXERCISES,
  WorkoutSession,
  WorkoutExercise,
  Exercise,
  addWorkoutToHistory,
  getActiveWorkout,
  updateActiveWorkout,
  MOCK_TEMPLATES,
  WorkoutTemplate
} from '@/constants/mockData';

const INITIAL_WORKOUT: WorkoutSession = {
  id: 'active',
  title: 'Nueva Sesión de Entrenamiento',
  date: 'Hoy',
  durationMinutes: 0,
  volumeKg: 0,
  exercisesCount: 0,
  exercises: []
};

export default function WorkoutScreen() {
  const theme = useTheme();
  const { isMobile, horizontalPadding } = useResponsive();

  const brandColors = {
    primary: Colors.light.primary, // Purple
    secondary: Colors.light.secondary, // Black
    accent: Colors.light.accent, // Purple
    warning: '#FF6B6B',
  };

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [workout, setWorkout] = useState<WorkoutSession>(() => getActiveWorkout());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [finishedStats, setFinishedStats] = useState({ duration: '', volume: 0, sets: 0 });

  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');
  const muscles = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

  const loadTemplate = (template: WorkoutTemplate) => {
    const newExercises: WorkoutExercise[] = template.exercises.map((templateEx) => {
      const baseEx = MOCK_EXERCISES.find(e => e.id === templateEx.exerciseId);
      return {
        id: templateEx.exerciseId,
        name: baseEx ? baseEx.name : 'Ejercicio Desconocido',
        muscleGroup: baseEx ? baseEx.muscleGroup : 'General',
        sets: templateEx.defaultSets.map((s, idx) => ({
          setNumber: idx + 1,
          weight: s.weight,
          reps: s.reps,
          completed: false
        }))
      };
    });

    const newWorkout: WorkoutSession = {
      id: 'active',
      title: `Entrenamiento de ${template.title}`,
      date: 'Hoy',
      durationMinutes: 0,
      volumeKg: 0,
      exercisesCount: newExercises.length,
      exercises: newExercises
    };

    setWorkout(newWorkout);
    setSecondsElapsed(0);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    updateActiveWorkout(workout);
  }, [workout]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    const updatedWorkout = { ...workout };
    const set = updatedWorkout.exercises[exerciseIndex].sets[setIndex];
    set.completed = !set.completed;
    setWorkout(updatedWorkout);
  };

  const updateWeight = (exerciseIndex: number, setIndex: number, val: string) => {
    const normalized = val.replace(',', '.');
    const num = normalized === '' ? 0 : parseFloat(normalized);
    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].weight = isNaN(num) ? 0 : num;
    setWorkout(updatedWorkout);
  };

  const updateReps = (exerciseIndex: number, setIndex: number, val: string) => {
    const num = val === '' ? 0 : parseInt(val, 10);
    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].reps = isNaN(num) ? 0 : num;
    setWorkout(updatedWorkout);
  };

  const selectExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: [{ setNumber: 1, weight: 0, reps: 0, completed: false }]
    };

    setWorkout(prev => ({ ...prev, exercises: [...prev.exercises, newWorkoutExercise] }));
    setSearchQuery('');
    setSelectedMuscle('Todos');
    setShowAddExerciseModal(false);
  };

  const addSet = (exerciseIndex: number) => {
    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[exerciseIndex];
    const setNumber = exercise.sets.length + 1;
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const weight = lastSet ? lastSet.weight : 0;
    const reps = lastSet ? lastSet.reps : 10;

    exercise.sets.push({ setNumber, weight, reps, completed: false });
    setWorkout(updatedWorkout);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[exerciseIndex];
    exercise.sets.splice(setIndex, 1);
    exercise.sets = exercise.sets.map((set, idx) => ({ ...set, setNumber: idx + 1 }));
    setWorkout(updatedWorkout);
  };

  const removeExercise = (exerciseIndex: number) => {
    const updatedWorkout = { ...workout };
    updatedWorkout.exercises.splice(exerciseIndex, 1);
    setWorkout(updatedWorkout);
  };

  const finishWorkout = () => {
    let totalVolume = 0;
    let completedSetsCount = 0;

    const completedExercises: WorkoutExercise[] = workout.exercises
      .map(ex => {
        const completedSets = ex.sets.filter(s => s.completed);
        return { ...ex, sets: completedSets };
      })
      .filter(ex => ex.sets.length > 0);

    completedExercises.forEach(ex => {
      ex.sets.forEach(s => {
        totalVolume += s.weight * s.reps;
        completedSetsCount++;
      });
    });

    const durationMin = Math.ceil(secondsElapsed / 60);

    const formatDate = () => {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const d = new Date();
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const completedSession: WorkoutSession = {
      id: Date.now().toString(),
      title: workout.title.trim() || 'Entrenamiento Completado',
      date: formatDate(),
      durationMinutes: durationMin === 0 ? 1 : durationMin,
      volumeKg: totalVolume,
      exercisesCount: completedExercises.length,
      exercises: completedExercises
    };

    addWorkoutToHistory(completedSession);

    setFinishedStats({
      duration: formatTime(secondsElapsed),
      volume: totalVolume,
      sets: completedSetsCount
    });

    setShowSuccessModal(true);
  };

  const resetWorkout = () => {
    setWorkout(JSON.parse(JSON.stringify(INITIAL_WORKOUT)));
    setSecondsElapsed(0);
    setShowSuccessModal(false);
  };

  const filteredExercises = MOCK_EXERCISES.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'Todos' || exercise.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const contentPlatformStyle = Platform.select({
    android: { paddingBottom: BottomTabInset + Spacing.four + 60 },
    ios: { paddingBottom: BottomTabInset + Spacing.four + 60 },
    web: { paddingBottom: Spacing.six + 60 }
  });

  const featuredTemplate = MOCK_TEMPLATES[0]; // Torso

  return (
    <View style={[styles.container]}>
      {/* Background Soft Pastel Gradient */}
      <LinearGradient
        colors={['#e0f2fe', '#f0fdf4', '#fefce8']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={[contentPlatformStyle, isMobile && workout.exercises.length > 0 && { paddingBottom: 80 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* PREMIUM PREVIEW STATE */}
        {workout.exercises.length === 0 ? (
          <View style={{ flex: 1 }}>
            <View style={[styles.heroImageContainer, isMobile && { height: 300 }]}>
              <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
                <View style={styles.heroHeader}>
                  <Pressable style={styles.iconCircle}>
                    <SymbolView name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} size={20} tintColor="#000" />
                  </Pressable>
                  <Text style={styles.heroHeaderText}>Detalles del Entreno</Text>
                  <Pressable style={styles.iconCircle}>
                    <SymbolView name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }} size={20} tintColor="#000" />
                  </Pressable>
                </View>

                {/* Hero Image */}
                <View style={styles.heroImageWrapper}>
                  <Image
                    source={require('@/assets/images/workout_hero.png')}
                    style={styles.heroImage}
                    resizeMode="contain"
                  />
                  {/* Subtle gradient to blend the bottom of the image */}
                  <LinearGradient
                    colors={['transparent', 'rgba(254, 252, 232, 0.8)', '#fefce8']}
                    style={styles.imageFade}
                  />
                </View>

              </SafeAreaView>
            </View>

            <View style={[styles.contentBody, { paddingHorizontal: horizontalPadding }]}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.heroTitle, isMobile && { fontSize: 24, lineHeight: 28 }]}>Construye Fuerza</Text>
                  <Text style={[styles.heroTitle, isMobile && { fontSize: 24, lineHeight: 28 }]}>Gana Potencia</Text>
                </View>
                <View style={styles.timeBadge}>
                  <SymbolView name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} size={12} tintColor="#000" />
                  <Text style={styles.timeBadgeText}>30 min</Text>
                </View>
              </View>

              <View style={styles.ratingRow}>
                <SymbolView name={{ ios: 'star.fill', android: 'star', web: 'star' }} size={14} tintColor="#fbbf24" />
                <Text style={styles.ratingText}>5.0</Text>
                <SymbolView name={{ ios: 'bolt.fill', android: 'bolt', web: 'bolt' }} size={14} tintColor="#64748b" style={{ marginLeft: 8 }} />
                <Text style={styles.powerPulseText}>Pulso de Potencia</Text>
              </View>

              <View style={[styles.infoCardsRow, isMobile && { gap: 8, marginTop: 16 }]}>
                <View style={styles.infoCard}>
                  <View style={styles.infoCardHeader}>
                    <SymbolView name={{ ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' }} size={14} tintColor="#000" />
                    <Text style={styles.infoCardTitle}>Calorías</Text>
                  </View>
                  <Text style={styles.infoCardValue}>1230 <Text style={styles.infoCardUnit}>kcal</Text></Text>
                </View>

                <View style={styles.infoCard}>
                  <View style={styles.infoCardHeader}>
                    <SymbolView name={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }} size={14} tintColor="#000" />
                    <Text style={styles.infoCardTitle}>Frecuencia</Text>
                  </View>
                  <Text style={styles.infoCardValue}>120 <Text style={styles.infoCardUnit}>bpm</Text></Text>
                </View>

                <View style={styles.infoCard}>
                  <View style={styles.infoCardHeader}>
                    <SymbolView name={{ ios: 'figure.run', android: 'directions_run', web: 'directions_run' }} size={14} tintColor="#000" />
                    <Text style={styles.infoCardTitle}>Tiempo</Text>
                  </View>
                  <Text style={styles.infoCardValue}>25/30 <Text style={styles.infoCardUnit}>min</Text></Text>
                </View>
              </View>

              <Text style={[styles.heroDesc, isMobile && { marginTop: 16 }]}>
                Desbloquea todo tu potencial con esta rutina de cuerpo completo. Diseñada con IA para estimular el crecimiento muscular y fuerza eficientemente.
              </Text>

              <Pressable
                style={[styles.joinButton, isMobile && { marginTop: 20 }]}
                onPress={() => loadTemplate(featuredTemplate)}
              >
                <Text style={styles.joinButtonText}>Unirte Ahora</Text>
              </Pressable>

              <Text style={[styles.sectionTitle, isMobile && { marginTop: 24, marginBottom: 12 }]}>Otras Rutinas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templatesScroll}>
                {MOCK_TEMPLATES.slice(1).map(t => (
                  <Pressable key={t.id} style={styles.smallTemplateCard} onPress={() => loadTemplate(t)}>
                    <View style={styles.smallTemplateIconBg}>
                      <SymbolView name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }} size={20} tintColor="#000" />
                    </View>
                    <Text style={styles.smallTemplateTitle}>{t.title}</Text>
                  </Pressable>
                ))}
                <Pressable style={styles.smallTemplateCard} onPress={() => setWorkout(JSON.parse(JSON.stringify(INITIAL_WORKOUT)))}>
                  <View style={styles.smallTemplateIconBg}>
                    <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} size={20} tintColor="#000" />
                  </View>
                  <Text style={styles.smallTemplateTitle}>Sesión Vacía</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        ) : (
          /* ACTIVE WORKOUT STATE (Also styled light) */
          <SafeAreaView style={styles.activeArea} edges={['top', 'left', 'right']}>
            <View style={[styles.activeHeader, isMobile && styles.activeHeaderMobile]}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.activeTitle}>Entrenando</Text>
                <TextInput
                  style={[styles.activeTitleInput, isMobile && { fontSize: 18 }]}
                  value={workout.title}
                  onChangeText={(text) => setWorkout(prev => ({ ...prev, title: text }))}
                  placeholderTextColor="#94a3b8"
                  numberOfLines={1}
                />
              </View>
              <View style={styles.timerPill}>
                <SymbolView name={{ ios: 'stopwatch.fill', android: 'timer', web: 'timer' }} size={16} tintColor="#000" />
                <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
              </View>
              <Pressable
                onPress={() => { setWorkout(JSON.parse(JSON.stringify(INITIAL_WORKOUT))); setSecondsElapsed(0); }}
                style={[styles.discardBtn, isMobile && styles.discardBtnMobile]}
              >
                <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} size={16} tintColor={brandColors.warning} />
              </Pressable>
            </View>

            <View style={{ paddingHorizontal: horizontalPadding }}>
              {workout.exercises.map((exercise, exIndex) => (
                <View key={`${exercise.id}-${exIndex}`} style={[styles.exerciseCard, isMobile && styles.exerciseCardMobile]}>
                  <View style={[styles.exerciseHeader, isMobile && styles.exerciseHeaderMobile]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.exerciseName, isMobile && { fontSize: 16 }]}>{exercise.name}</Text>
                      <Text style={styles.exerciseMuscle}>{exercise.muscleGroup}</Text>
                    </View>
                    <Pressable onPress={() => removeExercise(exIndex)}>
                      <SymbolView name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }} size={18} tintColor={brandColors.warning} />
                    </Pressable>
                  </View>

                  <View style={styles.tableHeader}>
                    <Text style={[styles.colText, { width: 40 }]}>SERIE</Text>
                    <Text style={[styles.colText, { flex: 1, textAlign: 'center' }]}>KG</Text>
                    <Text style={[styles.colText, { flex: 1, textAlign: 'center' }]}>REPS</Text>
                    <Text style={[styles.colText, { width: 40, textAlign: 'center' }]}>✔</Text>
                  </View>

                  {exercise.sets.map((set, setIndex) => (
                    <View key={`${setIndex}-${set.setNumber}`} style={[styles.setRow, isMobile && styles.setRowMobile, set.completed && styles.setRowCompleted]}>
                      <Text style={[styles.rowSetNum, set.completed && { color: brandColors.primary }]}>{set.setNumber}</Text>

                      <TextInput
                        style={[styles.inputBox, set.completed && styles.inputBoxCompleted]}
                        keyboardType="numeric"
                        value={set.weight === 0 ? '' : set.weight.toString()}
                        placeholder="0"
                        placeholderTextColor="#94a3b8"
                        onChangeText={(val) => updateWeight(exIndex, setIndex, val)}
                        editable={!set.completed}
                      />

                      <TextInput
                        style={[styles.inputBox, set.completed && styles.inputBoxCompleted]}
                        keyboardType="numeric"
                        value={set.reps === 0 ? '' : set.reps.toString()}
                        placeholder="0"
                        placeholderTextColor="#94a3b8"
                        onChangeText={(val) => updateReps(exIndex, setIndex, val)}
                        editable={!set.completed}
                      />

                      <Pressable
                        onPress={() => toggleSetCompleted(exIndex, setIndex)}
                        style={[styles.checkBtn, isMobile && styles.checkBtnMobile, set.completed && { backgroundColor: brandColors.primary }]}
                      >
                        {set.completed && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={16} tintColor="#fff" />}
                      </Pressable>
                    </View>
                  ))}

                  <Pressable style={[styles.addSetBtn, isMobile && styles.addSetBtnMobile]} onPress={() => addSet(exIndex)}>
                    <Text style={styles.addSetBtnText}>+ Agregar Serie</Text>
                  </Pressable>
                </View>
              ))}

              <View style={styles.actionsContainer}>
                <Pressable style={styles.addExBtn} onPress={() => setShowAddExerciseModal(true)}>
                  <Text style={styles.addExBtnText}>Agregar Ejercicio</Text>
                </Pressable>
                {!isMobile && (
                  <Pressable style={styles.finishBtn} onPress={finishWorkout}>
                    <Text style={styles.finishBtnText}>Finalizar</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </SafeAreaView>
        )}
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Finish Button - Mobile Only */}
      {isMobile && workout.exercises.length > 0 && (
        <View style={styles.stickyFinishContainer}>
          <Pressable style={styles.stickyFinishBtn} onPress={finishWorkout}>
            <Text style={styles.finishBtnText}>Finalizar</Text>
          </Pressable>
        </View>
      )}

      {/* Add Exercise Modal (Light) */}
      <Modal animationType="slide" transparent={true} visible={showAddExerciseModal} onRequestClose={() => setShowAddExerciseModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buscar Ejercicio</Text>
              <Pressable onPress={() => setShowAddExerciseModal(false)}>
                <SymbolView name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }} size={24} tintColor="#64748b" />
              </Pressable>
            </View>
            <View style={styles.searchContainer}>
              <SymbolView name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} size={18} tintColor="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Ej: Press de banca..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {filteredExercises.map(ex => (
                <Pressable key={ex.id} style={styles.exItem} onPress={() => selectExercise(ex)}>
                  <View>
                    <Text style={styles.exItemName}>{ex.name}</Text>
                    <Text style={styles.exItemMuscle}>{ex.muscleGroup}</Text>
                  </View>
                  <SymbolView name={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' }} size={24} tintColor={brandColors.primary} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal animationType="fade" transparent={true} visible={showSuccessModal} onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCentered}>
            <SymbolView name={{ ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' }} size={64} tintColor={brandColors.primary} />
            <Text style={styles.successTitle}>¡Completado!</Text>
            <Text style={styles.successDesc}>Gran trabajo hoy.</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{finishedStats.duration}</Text>
                <Text style={styles.statLbl}>Tiempo</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{finishedStats.volume}kg</Text>
                <Text style={styles.statLbl}>Volumen</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{finishedStats.sets}</Text>
                <Text style={styles.statLbl}>Series</Text>
              </View>
            </View>
            <Pressable style={styles.successBtn} onPress={resetWorkout}>
              <Text style={styles.successBtnText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // HERO SECTION (PREVIEW LIGHT THEME)
  heroImageContainer: { height: 400, position: 'relative' },
  heroSafeArea: { flex: 1, zIndex: 10 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Layout.lg, paddingTop: Layout.sm },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  heroHeaderText: { color: '#000', fontSize: 16, fontWeight: '700' },

  heroImageWrapper: { position: 'absolute', top: 60, left: 0, right: 0, bottom: 0 },
  heroImage: { width: '100%', height: '100%' },
  imageFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },

  contentBody: { paddingHorizontal: Layout.lg, paddingTop: Layout.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroTitle: { color: '#000', fontSize: 32, fontWeight: '800', lineHeight: 36 },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: Layout.xs, paddingVertical: 6, borderRadius: 16 },
  timeBadgeText: { color: '#000', fontSize: 12, fontWeight: '700' },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  ratingText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  powerPulseText: { color: '#64748b', fontSize: 14, fontStyle: 'italic' },

  infoCardsRow: { flexDirection: 'row', gap: Layout.xs, marginTop: Layout.lg },
  infoCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 20, padding: Layout.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  infoCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  infoCardTitle: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  infoCardValue: { color: '#000', fontSize: 16, fontWeight: '800' },
  infoCardUnit: { fontSize: 12, fontWeight: '500', color: '#64748b' },

  heroDesc: { color: '#64748b', fontSize: 14, lineHeight: 22, marginTop: Layout.lg },

  joinButton: { marginTop: 32, backgroundColor: '#a855f7', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#a855f7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  joinButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '800' },

  sectionTitle: { color: '#000', fontSize: 18, fontWeight: '800', marginTop: 40, marginBottom: Layout.sm },
  templatesScroll: { gap: Layout.sm, paddingBottom: Layout.md },
  smallTemplateCard: { width: 140, height: 110, borderRadius: 24, backgroundColor: '#ffffff', padding: Layout.sm, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  smallTemplateIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  smallTemplateTitle: { color: '#000', fontSize: 15, fontWeight: '700' },

  // ACTIVE WORKOUT (LIGHT THEME)
  activeArea: { flex: 1, paddingTop: Layout.md },
  activeHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Layout.md, marginBottom: Layout.lg, gap: Layout.xs },
  activeTitle: { color: '#64748b', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  activeTitleInput: { color: '#000', fontSize: 24, fontWeight: '800', marginTop: 4 },
  timerPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', paddingHorizontal: Layout.xs, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  timerText: { color: '#000', fontSize: 16, fontWeight: '700' },
  discardBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 107, 107, 0.1)', justifyContent: 'center', alignItems: 'center' },

  exerciseCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: Layout.sm, marginBottom: Layout.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Layout.sm },
  exerciseName: { color: '#000', fontSize: 18, fontWeight: '800' },
  exerciseMuscle: { color: '#64748b', fontSize: 14, marginTop: 2 },

  tableHeader: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 8 },
  colText: { color: '#64748b', fontSize: 12, fontWeight: '700' },

  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 12 },
  setRowCompleted: { backgroundColor: '#f0fdf4' }, // Light green
  rowSetNum: { color: '#000', width: 40, fontSize: 16, fontWeight: '700' },
  inputBox: { flex: 1, backgroundColor: '#f1f5f9', color: '#000', borderRadius: 12, marginHorizontal: 4, height: 44, textAlign: 'center', fontWeight: '700' },
  inputBoxCompleted: { backgroundColor: 'transparent', color: '#a855f7' },
  checkBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  addSetBtn: { marginTop: Layout.xs, alignSelf: 'center', padding: 8 },
  addSetBtnText: { color: '#64748b', fontSize: 14, fontWeight: '700' },

  actionsContainer: { gap: Layout.xs, marginTop: 8, marginBottom: 40 },
  addExBtn: { height: 56, borderRadius: 28, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  addExBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  finishBtn: { height: 56, borderRadius: 28, backgroundColor: '#a855f7', justifyContent: 'center', alignItems: 'center', shadowColor: '#a855f7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  finishBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },

  // MODALS (LIGHT THEME)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: Layout.lg, paddingBottom: 60 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Layout.md },
  modalTitle: { color: '#000', fontSize: 20, fontWeight: '800' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, paddingHorizontal: Layout.sm, height: 50, marginBottom: Layout.sm, gap: Layout.xs },
  searchInput: { flex: 1, color: '#000', fontSize: 16, fontWeight: '500' },
  exItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  exItemName: { color: '#000', fontSize: 16, fontWeight: '700' },
  exItemMuscle: { color: '#64748b', fontSize: 14, marginTop: 4 },

  modalContentCentered: { backgroundColor: '#ffffff', margin: Layout.lg, borderRadius: 32, padding: 32, alignItems: 'center' },
  successTitle: { color: '#000', fontSize: 24, fontWeight: '800', marginTop: Layout.sm },
  successDesc: { color: '#64748b', fontSize: 16, marginTop: 4, marginBottom: Layout.lg },
  statsGrid: { flexDirection: 'row', gap: Layout.xs, marginBottom: 32, width: '100%' },
  statBox: { flex: 1, backgroundColor: '#f1f5f9', padding: Layout.sm, borderRadius: 20, alignItems: 'center' },
  statVal: { color: '#000', fontSize: 18, fontWeight: '800' },
  statLbl: { color: '#64748b', fontSize: 12, marginTop: 4, fontWeight: '600' },
  successBtn: { width: '100%', height: 56, borderRadius: 28, backgroundColor: '#a855f7', justifyContent: 'center', alignItems: 'center' },
  successBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },

  // MOBILE-SPECIFIC STYLES
  activeHeaderMobile: { paddingHorizontal: Layout.sm, marginBottom: Layout.xs, gap: 8 },
  discardBtnMobile: { width: 48, height: 48, borderRadius: 24 },
  exerciseCardMobile: { padding: Layout.xs, marginBottom: 10, borderRadius: 20 },
  exerciseHeaderMobile: { marginBottom: 10 },
  setRowMobile: { paddingVertical: 6 },
  checkBtnMobile: { width: 48, height: 48, borderRadius: 24 },
  addSetBtnMobile: { minHeight: 48, justifyContent: 'center' },
  stickyFinishContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Layout.sm,
    paddingBottom: Layout.lg,
    paddingTop: Layout.xs,
    backgroundColor: 'rgba(240, 253, 244, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  stickyFinishBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
