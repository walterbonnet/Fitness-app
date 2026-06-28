import React, { useState, useMemo } from 'react';
import { 
  Platform, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { MOCK_EXERCISES, Exercise } from '@/constants/mockData';

// Module-level constant (avoid recreation on every render)
const BRAND_COLORS = {
  primary: '#A3E635',
  secondary: '#00F0FF',
  accent: '#A855F7',
  warning: '#FF6B6B',
  difficulty: {
    Principiante: '#22C55E',
    Intermedio: '#F59E0B',
    Avanzado: '#EF4444',
  }
} as const;

export default function ExercisesScreen() {
  const theme = useTheme();
  const { horizontalPadding } = useResponsive();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('Todos');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Constants for filters
  const muscles = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];
  const equipments = ['Todos', 'Barra', 'Mancuernas', 'Máquina', 'Peso Corporal', 'Poleas'];

  // Filtering Logic in Memory
  const filteredExercises = useMemo(() => {
    return MOCK_EXERCISES.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = selectedMuscle === 'Todos' || exercise.muscleGroup === selectedMuscle;
      const matchesEquipment = selectedEquipment === 'Todos' || exercise.equipment === selectedEquipment;
      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment]);

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
            <Text style={[styles.title, { color: theme.text }]}>Biblioteca</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Busca ejercicios y aprende la técnica correcta
            </Text>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
            <SymbolView 
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} 
              size={18} 
              tintColor={theme.textSecondary} 
            />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Buscar ejercicio..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <SymbolView 
                  name={{ ios: 'xmark.circle.fill', android: 'clear', web: 'clear' }} 
                  size={16} 
                  tintColor={theme.textSecondary} 
                />
              </Pressable>
            )}
          </View>

          {/* Muscle Filter Scroll */}
          <View style={styles.filterWrapper}>
            <Text style={[styles.filterTitle, { color: theme.textSecondary }]}>GRUPO MUSCULAR</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.filterScroll}
            >
              {muscles.map((muscle) => (
                <Pressable
                  key={muscle}
                  style={({ pressed }) => [
                    styles.filterChip,
                    { 
                      backgroundColor: selectedMuscle === muscle ? BRAND_COLORS.primary : theme.backgroundElement,
                      borderColor: selectedMuscle === muscle ? 'transparent' : theme.backgroundSelected
                    },
                    pressed && styles.pressed
                  ]}
                  onPress={() => setSelectedMuscle(muscle)}
                >
                  <Text style={[
                    styles.filterChipText, 
                    { color: selectedMuscle === muscle ? '#000000' : theme.text }
                  ]}>
                    {muscle}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Equipment Filter Scroll */}
          <View style={styles.filterWrapper}>
            <Text style={[styles.filterTitle, { color: theme.textSecondary }]}>EQUIPAMIENTO</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.filterScroll}
            >
              {equipments.map((equip) => (
                <Pressable
                  key={equip}
                  style={({ pressed }) => [
                    styles.filterChip,
                    { 
                      backgroundColor: selectedEquipment === equip ? BRAND_COLORS.secondary : theme.backgroundElement,
                      borderColor: selectedEquipment === equip ? 'transparent' : theme.backgroundSelected
                    },
                    pressed && styles.pressed
                  ]}
                  onPress={() => setSelectedEquipment(equip)}
                >
                  <Text style={[
                    styles.filterChipText, 
                    { color: selectedEquipment === equip ? '#000000' : theme.text }
                  ]}>
                    {equip}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Exercises Catalog */}
          <View style={styles.listContainer}>
            <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
              {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''} encontrado{filteredExercises.length !== 1 ? 's' : ''}
            </Text>

            {filteredExercises.map((exercise) => (
              <Pressable
                key={exercise.id}
                style={({ pressed }) => [
                  styles.exerciseCard,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                  pressed && styles.pressed
                ]}
                onPress={() => setSelectedExercise(exercise)}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, { color: theme.text }]}>{exercise.name}</Text>
                  
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
                      <Text style={[styles.badgeText, { color: BRAND_COLORS.primary }]}>{exercise.muscleGroup}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
                      <Text style={[styles.badgeText, { color: BRAND_COLORS.secondary }]}>{exercise.equipment}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  {/* Difficulty Tag */}
                  <View style={[
                    styles.difficultyTag, 
                    { backgroundColor: BRAND_COLORS.difficulty[exercise.difficulty] + '15' }
                  ]}>
                    <Text style={[
                      styles.difficultyText, 
                      { color: BRAND_COLORS.difficulty[exercise.difficulty] }
                    ]}>
                      {exercise.difficulty}
                    </Text>
                  </View>
                  <SymbolView 
                    name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} 
                    size={16} 
                    tintColor={theme.textSecondary} 
                  />
                </View>
              </Pressable>
            ))}

            {filteredExercises.length === 0 && (
              <View style={styles.emptyContainer}>
                <SymbolView 
                  name={{ ios: 'info.circle', android: 'info', web: 'info' }} 
                  size={32} 
                  tintColor={theme.textSecondary} 
                />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No se encontraron ejercicios con los filtros seleccionados.
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Guide Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedExercise !== null}
        onRequestClose={() => setSelectedExercise(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundElement }]}>
            {selectedExercise && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1, marginRight: Spacing.two }}>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedExercise.name}</Text>
                    <View style={styles.modalBadgeRow}>
                      <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
                        <Text style={[styles.badgeText, { color: BRAND_COLORS.primary }]}>{selectedExercise.muscleGroup}</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
                        <Text style={[styles.badgeText, { color: BRAND_COLORS.secondary }]}>{selectedExercise.equipment}</Text>
                      </View>
                      <View style={[
                        styles.badge, 
                        { backgroundColor: BRAND_COLORS.difficulty[selectedExercise.difficulty] + '15' }
                      ]}>
                        <Text style={[
                          styles.badgeText, 
                          { color: BRAND_COLORS.difficulty[selectedExercise.difficulty] }
                        ]}>
                          {selectedExercise.difficulty}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable 
                    onPress={() => setSelectedExercise(null)}
                    style={({ pressed }) => [styles.closeIcon, pressed && styles.pressed]}
                  >
                    <SymbolView 
                      name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }} 
                      size={24} 
                      tintColor={theme.textSecondary} 
                    />
                  </Pressable>
                </View>

                {/* Detailed Information ScrollView */}
                <ScrollView 
                  style={styles.modalScrollView} 
                  showsVerticalScrollIndicator={false}
                >
                  {/* Descripción Breve */}
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalDescriptionText, { color: theme.text }]}>
                      {selectedExercise.description}
                    </Text>
                  </View>

                  {/* Músculos Implicados */}
                  <View style={styles.modalSection}>
                    <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>MÚSCULOS IMPLICADOS</Text>
                    
                    <View style={styles.muscleRolesContainer}>
                      {/* Principal */}
                      <View style={styles.muscleRoleItem}>
                        <Text style={[styles.muscleRoleLabel, { color: theme.textSecondary }]}>Principal:</Text>
                        <View style={[styles.badge, { backgroundColor: theme.backgroundSelected, alignSelf: 'flex-start' }]}>
                          <Text style={[styles.badgeText, { color: BRAND_COLORS.primary }]}>
                            {selectedExercise.muscleGroup}
                          </Text>
                        </View>
                      </View>

                      {/* Secundarios */}
                      {selectedExercise.secondaryMuscles && selectedExercise.secondaryMuscles.length > 0 && (
                        <View style={styles.muscleRoleItem}>
                          <Text style={[styles.muscleRoleLabel, { color: theme.textSecondary }]}>Secundarios:</Text>
                          <View style={styles.secondaryBadgesRow}>
                            {selectedExercise.secondaryMuscles.map((muscle, idx) => (
                              <View key={idx} style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
                                <Text style={[styles.badgeText, { color: theme.text }]}>{muscle}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Beneficios */}
                  {selectedExercise.benefits && selectedExercise.benefits.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>BENEFICIOS</Text>
                      {selectedExercise.benefits.map((benefit, idx) => (
                        <View key={idx} style={styles.benefitRow}>
                          <SymbolView 
                            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }} 
                            size={14} 
                            tintColor={BRAND_COLORS.secondary} 
                          />
                          <Text style={[styles.benefitText, { color: theme.text }]}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Instrucciones Paso a Paso */}
                  <View style={styles.modalSection}>
                    <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>INSTRUCCIONES DE EJECUCIÓN</Text>
                    {selectedExercise.instructions.map((step, index) => (
                      <View key={index} style={styles.stepRow}>
                        <View style={[styles.stepNumCircle, { backgroundColor: BRAND_COLORS.primary }]}>
                          <Text style={styles.stepNumText}>{index + 1}</Text>
                        </View>
                        <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
                      </View>
                    ))}
                  </View>
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
    width: '100%',
  },
  safeArea: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
    paddingTop: Spacing.three,
    width: '100%',
    alignSelf: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    height: 46,
    borderRadius: Spacing.three,
    borderWidth: 1,
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    height: '100%',
    padding: 0,
  },
  filterWrapper: {
    gap: Spacing.one,
  },
  filterTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    paddingLeft: Spacing.one,
  },
  filterScroll: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContainer: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  resultsText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.one,
    paddingLeft: Spacing.one,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
  },
  exerciseInfo: {
    flex: 1,
    gap: Spacing.two,
    marginRight: Spacing.two,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  difficultyTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: Spacing.five,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: Spacing.three,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  modalBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  closeIcon: {
    padding: Spacing.one,
  },
  modalScrollView: {
    marginVertical: Spacing.one,
  },
  instructionsHeader: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: Spacing.three,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.three,
    alignItems: 'flex-start',
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  modalSection: {
    marginBottom: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: Spacing.three,
  },
  modalDescriptionText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
  },
  muscleRolesContainer: {
    gap: Spacing.two,
  },
  muscleRoleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  muscleRoleLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 90,
  },
  secondaryBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginVertical: Spacing.one,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

