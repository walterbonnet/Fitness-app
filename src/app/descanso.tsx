import React, { useState, useEffect } from 'react';
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
import { getRestTimerDuration, updateRestTimerDuration } from '@/constants/mockData';

// Module-level constant (avoid recreation on every render)
const BRAND_COLORS = {
  primary: '#A3E635', // Neon Green
  secondary: '#00F0FF', // Cyan
  warning: '#FF6B6B', // Coral Red
  accent: '#A855F7', // Purple
} as const;

export default function RestTimerScreen() {
  const theme = useTheme();
  const { isMobile, screenWidth, horizontalPadding } = useResponsive();
  

  // Timer states
  const [initialTime, setInitialTime] = useState(() => getRestTimerDuration()); // default 90s
  const [timeLeft, setTimeLeft] = useState(() => getRestTimerDuration());
  const [isActive, setIsActive] = useState(false);

  // Custom Time modal states
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customMin, setCustomMin] = useState('1');
  const [customSec, setCustomSec] = useState('30');

  useEffect(() => {
    updateRestTimerDuration(initialTime);
  }, [initialTime]);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Format time display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Selection chips
  const presets = [
    { label: '30s', value: 30 },
    { label: '60s', value: 60 },
    { label: '90s', value: 90 },
    { label: '2 min', value: 120 },
    { label: '3 min', value: 180 },
  ];

  const handlePresetSelect = (value: number) => {
    setIsActive(false);
    setInitialTime(value);
    setTimeLeft(value);
  };

  const handlePlayPause = () => {
    // If timer is completed, reset to initial before playing
    if (timeLeft === 0) {
      setTimeLeft(initialTime);
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  // Add seconds to current timer
  const handleAddSeconds = (seconds: number) => {
    setTimeLeft(prev => prev + seconds);
    setInitialTime(prev => prev + seconds);
  };

  // Open custom modal and initialize fields
  const openCustomModal = () => {
    const mins = Math.floor(initialTime / 60).toString();
    const secs = (initialTime % 60).toString();
    setCustomMin(mins);
    setCustomSec(secs);
    setShowCustomModal(true);
  };

  // Apply custom time
  const handleSetCustomTime = () => {
    const mins = parseInt(customMin, 10) || 0;
    const secs = parseInt(customSec, 10) || 0;
    const total = (mins * 60) + secs;
    if (total > 0) {
      setIsActive(false);
      setInitialTime(total);
      setTimeLeft(total);
      setShowCustomModal(false);
    }
  };

  const progress = timeLeft / initialTime;

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
            <Text style={[styles.title, { color: theme.text }]}>Temporizador</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Controla tus tiempos de descanso entre series
            </Text>
          </View>

          {/* Big Circular Timer Component */}
          <View style={styles.timerWrapper}>
            <View style={[
              styles.timerRing, 
              { 
                borderColor: theme.backgroundSelected,
                shadowColor: isActive ? BRAND_COLORS.warning : 'transparent',
                ...(isMobile ? { width: Math.min(220, screenWidth * 0.55), height: Math.min(220, screenWidth * 0.55), borderRadius: Math.min(110, screenWidth * 0.275) } : {}),
              }
            ]}>
              {/* Dynamic Inner Glow Border */}
              <View style={[
                styles.timerProgressBorder, 
                { 
                  borderColor: isActive ? BRAND_COLORS.warning : BRAND_COLORS.primary,
                  transform: [{ rotate: `${progress * 360}deg` }],
                  opacity: 0.8
                }
              ]} />
              
              <Text style={[styles.timeDisplay, { color: theme.text }, isMobile && { fontSize: 42 }]}>
                {formatTime(timeLeft)}
              </Text>
              
              <Text style={[
                styles.timerStatus, 
                { color: timeLeft === 0 ? BRAND_COLORS.warning : theme.textSecondary }
              ]}>
                {timeLeft === 0 ? '¡TIEMPO COMPLETADO!' : isActive ? 'ENTRENANDO DESCANSO...' : 'PAUSADO'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundSelected }]}>
            <View style={[
              styles.progressBar, 
              { 
                width: `${progress * 100}%`,
                backgroundColor: isActive ? BRAND_COLORS.warning : BRAND_COLORS.primary 
              }
            ]} />
          </View>

          {/* Quick Increment Buttons */}
          <View style={styles.quickAdjustRow}>
            <Pressable
              style={({ pressed }) => [
                styles.quickAdjustButton,
                { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                pressed && styles.pressed
              ]}
              onPress={() => handleAddSeconds(30)}
            >
              <SymbolView 
                name={{ ios: 'plus', android: 'add', web: 'add' }} 
                size={14} 
                tintColor={BRAND_COLORS.primary} 
              />
              <Text style={[styles.quickAdjustText, { color: theme.text }]}>+30s</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.quickAdjustButton,
                { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                pressed && styles.pressed
              ]}
              onPress={() => handleAddSeconds(60)}
            >
              <SymbolView 
                name={{ ios: 'plus', android: 'add', web: 'add' }} 
                size={14} 
                tintColor={BRAND_COLORS.primary} 
              />
              <Text style={[styles.quickAdjustText, { color: theme.text }]}>+1 min</Text>
            </Pressable>
          </View>

          {/* Preset Buttons */}
          <View style={[styles.presetContainer, isMobile && { flexWrap: 'wrap' }]}>
            {presets.map((preset) => (
              <Pressable
                key={preset.value}
                style={({ pressed }) => [
                  styles.presetChip,
                  { 
                    backgroundColor: initialTime === preset.value 
                      ? BRAND_COLORS.primary 
                      : theme.backgroundElement,
                    borderColor: initialTime === preset.value
                      ? 'transparent'
                      : theme.backgroundSelected
                  },
                  pressed && styles.pressed
                ]}
                onPress={() => handlePresetSelect(preset.value)}
              >
                <Text style={[
                  styles.presetText, 
                  { 
                    color: initialTime === preset.value 
                      ? '#000000' 
                      : theme.text 
                  }
                ]}>
                  {preset.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Custom Time Button */}
          <Pressable
            style={({ pressed }) => [
              styles.customTimeButton,
              { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
              pressed && styles.pressed
            ]}
            onPress={openCustomModal}
          >
            <SymbolView 
              name={{ ios: 'timer', android: 'timer', web: 'timer' }} 
              size={18} 
              tintColor={BRAND_COLORS.secondary} 
            />
            <Text style={[styles.customTimeButtonText, { color: theme.text }]}>Ajustar Tiempo Personalizado</Text>
          </Pressable>

          {/* Action Buttons */}
          <View style={styles.controlsRow}>
            {/* Reset Button */}
            <Pressable
              style={({ pressed }) => [
                styles.controlButton,
                styles.resetButton,
                { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                pressed && styles.pressed
              ]}
              onPress={handleReset}
            >
              <SymbolView 
                name={{ ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' }} 
                size={22} 
                tintColor={theme.text} 
              />
              <Text style={[styles.controlButtonText, { color: theme.text }]}>Reiniciar</Text>
            </Pressable>

            {/* Play/Pause Button */}
            <Pressable
              style={({ pressed }) => [
                styles.controlButton,
                styles.playButton,
                { backgroundColor: isActive ? BRAND_COLORS.warning : BRAND_COLORS.primary },
                pressed && styles.pressed
              ]}
              onPress={handlePlayPause}
            >
              <SymbolView 
                name={{ 
                  ios: isActive ? 'pause.fill' : 'play.fill', 
                  android: isActive ? 'pause' : 'play_arrow', 
                  web: isActive ? 'pause' : 'play_arrow' 
                }} 
                size={22} 
                tintColor="#000000" 
              />
              <Text style={[styles.controlButtonText, { color: '#000000' }]}>
                {isActive ? 'Pausar' : 'Iniciar'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Custom Time Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCustomModal}
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Ajustar Tiempo</Text>
            
            <View style={styles.inputsRow}>
              <View style={styles.inputCol}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>MINUTOS</Text>
                <TextInput
                  style={[styles.timeInput, { backgroundColor: theme.backgroundSelected, color: theme.text }]}
                  keyboardType="number-pad"
                  value={customMin}
                  onChangeText={setCustomMin}
                  maxLength={2}
                  selectTextOnFocus
                />
              </View>
              <Text style={[styles.colonDivider, { color: theme.text }]}>:</Text>
              <View style={styles.inputCol}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>SEGUNDOS</Text>
                <TextInput
                  style={[styles.timeInput, { backgroundColor: theme.backgroundSelected, color: theme.text }]}
                  keyboardType="number-pad"
                  value={customSec}
                  onChangeText={setCustomSec}
                  maxLength={2}
                  selectTextOnFocus
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalActionButton,
                  { backgroundColor: BRAND_COLORS.primary },
                  pressed && styles.pressed
                ]}
                onPress={handleSetCustomTime}
              >
                <Text style={styles.modalActionText}>Establecer</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.modalCloseButton,
                  { borderColor: theme.backgroundSelected },
                  pressed && styles.pressed
                ]}
                onPress={() => setShowCustomModal(false)}
              >
                <Text style={[styles.modalCloseText, { color: theme.text }]}>Cancelar</Text>
              </Pressable>
            </View>
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
    alignItems: 'center',
  },
  header: {
    width: '100%',
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
  timerWrapper: {
    marginVertical: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    position: 'relative',
  },
  timerProgressBorder: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  timeDisplay: {
    fontSize: 54,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  timerStatus: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: Spacing.two,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  quickAdjustRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.three,
    marginVertical: Spacing.one,
  },
  quickAdjustButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    gap: Spacing.one,
  },
  quickAdjustText: {
    fontSize: 13,
    fontWeight: '700',
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.two,
    marginVertical: Spacing.one,
  },
  presetChip: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
    borderWidth: 1,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '700',
  },
  customTimeButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    gap: Spacing.two,
    marginVertical: Spacing.one,
  },
  customTimeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  resetButton: {
    borderWidth: 1,
  },
  playButton: {},
  controlButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.four,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  inputCol: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeInput: {
    width: 70,
    height: 50,
    borderRadius: Spacing.two,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
  },
  colonDivider: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: Spacing.four,
  },
  modalButtons: {
    width: '100%',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  modalActionButton: {
    width: '100%',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  modalActionText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: '100%',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
