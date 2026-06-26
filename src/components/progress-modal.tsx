import React, { useState, useEffect } from 'react';
import { 
  Platform, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  Modal,
  Image
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { 
  getProgressLogs, 
  addProgressLog, 
  subscribeToProgress, 
  ProgressLog 
} from '@/constants/mockData';

interface ProgressModalProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'registrar' | 'graficas' | 'fotos';
type MetricType = 'weight' | 'cintura' | 'pecho' | 'cadera';

const SILHOUETTES = [
  { id: 's1', name: 'Torso/Abs', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300' },
  { id: 's2', name: 'Espalda', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300' },
  { id: 's3', name: 'Piernas/Fuerza', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300' }
];

export default function ProgressModal({ visible, onClose }: ProgressModalProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('registrar');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  const [logs, setLogs] = useState<ProgressLog[]>(() => getProgressLogs());
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  // Form states
  const [weight, setWeight] = useState('');
  const [cintura, setCintura] = useState('');
  const [pecho, setPecho] = useState('');
  const [cadera, setCadera] = useState('');
  const [date, setDate] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const brandColors = {
    primary: '#A3E635', // Neon Green
    secondary: '#00F0FF', // Cyan
    warning: '#FF6B6B', // Coral Red
    accent: '#A855F7', // Purple
    info: '#F59E0B', // Amber
  };

  useEffect(() => {
    const unsubscribe = subscribeToProgress((newLogs) => {
      setLogs(newLogs);
    });

    // Set today's date formatted as YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);

    return () => unsubscribe();
  }, []);

  // Format date display
  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const day = parseInt(parts[2], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        return `${day} ${months[monthIndex]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleAddPhotoWeb = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setPhoto(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Fallback for native devices
      setPhoto(SILHOUETTES[0].url);
    }
  };

  const handleSaveLog = () => {
    const wNum = parseFloat(weight);
    const cinNum = parseFloat(cintura);
    const pechNum = parseFloat(pecho);
    const cadNum = parseFloat(cadera);

    if (isNaN(wNum) || isNaN(cinNum) || isNaN(pechNum) || isNaN(cadNum) || !date) {
      alert('Por favor, introduce todos los valores numéricos de forma válida.');
      return;
    }

    const logData = {
      date,
      weight: wNum,
      cintura: cinNum,
      pecho: pechNum,
      cadera: cadNum,
      photos: photo ? [photo] : []
    };

    addProgressLog(logData);

    // Reset inputs
    setWeight('');
    setCintura('');
    setPecho('');
    setCadera('');
    setPhoto(null);
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      setActiveTab('graficas');
    }, 1200);
  };

  // Prepare chart metrics
  const chartData = [...logs].reverse(); // oldest first for chronological chart
  const selectedValues = chartData.map(l => l[selectedMetric]);
  const minVal = selectedValues.length > 0 ? Math.min(...selectedValues) : 0;
  const maxVal = selectedValues.length > 0 ? Math.max(...selectedValues) : 100;
  const range = maxVal - minVal;
  const padding = range === 0 ? 5 : range * 0.2;
  const chartMin = Math.max(0, minVal - padding);
  const chartMax = maxVal + padding;

  const getMetricLabel = (key: MetricType) => {
    switch (key) {
      case 'weight': return 'Peso (kg)';
      case 'cintura': return 'Cintura (cm)';
      case 'pecho': return 'Pecho (cm)';
      case 'cadera': return 'Cadera (cm)';
    }
  };

  const getMetricColor = (key: MetricType) => {
    switch (key) {
      case 'weight': return brandColors.primary;
      case 'cintura': return brandColors.secondary;
      case 'pecho': return brandColors.accent;
      case 'cadera': return brandColors.info;
    }
  };

  // Get list of all photos
  const allPhotos = logs.reduce<{ url: string; date: string }[]>((acc, log) => {
    if (log.photos && log.photos.length > 0) {
      log.photos.forEach(p => {
        acc.push({ url: p, date: log.date });
      });
    }
    return acc;
  }, []);

  const activeLog = activeBarIndex !== null && chartData[activeBarIndex] ? chartData[activeBarIndex] : null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: theme.backgroundSelected }]}>
            <View style={styles.titleRow}>
              <SymbolView 
                name={{ ios: 'chart.bar.fill', android: 'trending_up', web: 'trending_up' }} 
                size={22} 
                tintColor={brandColors.info} 
              />
              <Text style={[styles.modalTitle, { color: theme.text }]}>Progreso Corporal</Text>
            </View>
            <Pressable 
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]} 
              onPress={onClose}
            >
              <SymbolView 
                name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }} 
                size={24} 
                tintColor={theme.textSecondary} 
              />
            </Pressable>
          </View>

          {/* Navigation Tabs */}
          <View style={[styles.tabsRow, { backgroundColor: theme.backgroundElement }]}>
            <Pressable 
              style={[
                styles.tabButton, 
                activeTab === 'registrar' && { backgroundColor: theme.backgroundSelected }
              ]}
              onPress={() => {
                setActiveTab('registrar');
                setActiveBarIndex(null);
              }}
            >
              <SymbolView 
                name={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add' }} 
                size={16} 
                tintColor={activeTab === 'registrar' ? brandColors.primary : theme.textSecondary} 
              />
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'registrar' ? theme.text : theme.textSecondary }
              ]}>Registrar</Text>
            </Pressable>

            <Pressable 
              style={[
                styles.tabButton, 
                activeTab === 'graficas' && { backgroundColor: theme.backgroundSelected }
              ]}
              onPress={() => {
                setActiveTab('graficas');
                setActiveBarIndex(null);
              }}
            >
              <SymbolView 
                name={{ ios: 'chart.line.uptrend.xyaxis', android: 'show_chart', web: 'show_chart' }} 
                size={16} 
                tintColor={activeTab === 'graficas' ? brandColors.secondary : theme.textSecondary} 
              />
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'graficas' ? theme.text : theme.textSecondary }
              ]}>Gráficas</Text>
            </Pressable>

            <Pressable 
              style={[
                styles.tabButton, 
                activeTab === 'fotos' && { backgroundColor: theme.backgroundSelected }
              ]}
              onPress={() => {
                setActiveTab('fotos');
                setActiveBarIndex(null);
              }}
            >
              <SymbolView 
                name={{ ios: 'photo.on.rectangle.angled', android: 'photo_library', web: 'image' }} 
                size={16} 
                tintColor={activeTab === 'fotos' ? brandColors.accent : theme.textSecondary} 
              />
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'fotos' ? theme.text : theme.textSecondary }
              ]}>Fotos</Text>
            </Pressable>
          </View>

          {/* Tab Contents */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'registrar' && (
              <View style={styles.formContainer}>
                {successMsg ? (
                  <View style={[styles.successBanner, { backgroundColor: 'rgba(163, 230, 53, 0.15)', borderColor: brandColors.primary }]}>
                    <SymbolView 
                      name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check' }} 
                      size={28} 
                      tintColor={brandColors.primary} 
                    />
                    <Text style={[styles.successText, { color: theme.text }]}>¡Registro guardado con éxito!</Text>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
                      Introduce tus medidas actuales para guardar tu evolución corporal.
                    </Text>

                    {/* Form Fields */}
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>FECHA DEL REGISTRO</Text>
                      <TextInput 
                        style={[styles.formInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                        value={date}
                        onChangeText={setDate}
                        placeholder="AAAA-MM-DD"
                        placeholderTextColor={theme.textSecondary}
                      />
                    </View>

                    <View style={styles.gridFields}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>PESO (KG)</Text>
                        <TextInput 
                          style={[styles.formInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                          keyboardType="decimal-pad"
                          placeholder="e.g. 78.5"
                          placeholderTextColor={theme.textSecondary}
                          value={weight}
                          onChangeText={setWeight}
                        />
                      </View>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>CINTURA (CM)</Text>
                        <TextInput 
                          style={[styles.formInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                          keyboardType="decimal-pad"
                          placeholder="e.g. 82"
                          placeholderTextColor={theme.textSecondary}
                          value={cintura}
                          onChangeText={setCintura}
                        />
                      </View>
                    </View>

                    <View style={styles.gridFields}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>PECHO (CM)</Text>
                        <TextInput 
                          style={[styles.formInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                          keyboardType="decimal-pad"
                          placeholder="e.g. 101"
                          placeholderTextColor={theme.textSecondary}
                          value={pecho}
                          onChangeText={setPecho}
                        />
                      </View>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>CADERA (CM)</Text>
                        <TextInput 
                          style={[styles.formInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                          keyboardType="decimal-pad"
                          placeholder="e.g. 96"
                          placeholderTextColor={theme.textSecondary}
                          value={cadera}
                          onChangeText={setCadera}
                        />
                      </View>
                    </View>

                    {/* Photos selection */}
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>FOTO DE PROGRESO</Text>
                      
                      <View style={styles.photoUploadContainer}>
                        {photo ? (
                          <View style={styles.previewContainer}>
                            <Image source={{ uri: photo }} style={styles.previewImage} />
                            <Pressable 
                              style={[styles.removePhotoBtn, { backgroundColor: brandColors.warning }]} 
                              onPress={() => setPhoto(null)}
                            >
                              <Text style={styles.removePhotoText}>Eliminar</Text>
                            </Pressable>
                          </View>
                        ) : (
                          <View style={styles.photoButtonsCol}>
                            <Pressable 
                              style={({ pressed }) => [
                                styles.uploadBtn, 
                                { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                                pressed && styles.pressed
                              ]}
                              onPress={handleAddPhotoWeb}
                            >
                              <SymbolView 
                                name={{ ios: 'camera.fill', android: 'photo_camera', web: 'camera' }} 
                                size={18} 
                                tintColor={brandColors.secondary} 
                              />
                              <Text style={[styles.uploadBtnText, { color: theme.text }]}>Cargar Foto del Dispositivo</Text>
                            </Pressable>

                            <Text style={[styles.templateText, { color: theme.textSecondary }]}>O elige una silueta de ejemplo:</Text>
                            <View style={styles.silhouetteRow}>
                              {SILHOUETTES.map((s) => (
                                <Pressable
                                  key={s.id}
                                  style={({ pressed }) => [
                                    styles.silhouetteChip,
                                    { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
                                    pressed && styles.pressed
                                  ]}
                                  onPress={() => setPhoto(s.url)}
                                >
                                  <Image source={{ uri: s.url }} style={styles.silhouetteThumb} />
                                  <Text style={[styles.silhouetteLabel, { color: theme.text }]}>{s.name}</Text>
                                </Pressable>
                              ))}
                            </View>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Save Button */}
                    <Pressable 
                      style={({ pressed }) => [
                        styles.saveBtn, 
                        { backgroundColor: brandColors.info },
                        pressed && styles.pressed
                      ]}
                      onPress={handleSaveLog}
                    >
                      <Text style={styles.saveBtnText}>Guardar Registro</Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}

            {activeTab === 'graficas' && (
              <View style={styles.chartsContainer}>
                {logs.length === 0 ? (
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    No hay registros suficientes para mostrar el gráfico. ¡Añade tu primer registro!
                  </Text>
                ) : (
                  <>
                    <Text style={[styles.chartTitle, { color: theme.text }]}>Gráficas de Evolución</Text>
                    
                    {/* Segmented Metric buttons */}
                    <View style={[styles.metricSegmentRow, { backgroundColor: theme.backgroundElement }]}>
                      {(['weight', 'cintura', 'pecho', 'cadera'] as MetricType[]).map((metric) => (
                        <Pressable 
                          key={metric}
                          style={[
                            styles.segmentBtn, 
                            selectedMetric === metric && { backgroundColor: theme.backgroundSelected }
                          ]}
                          onPress={() => {
                            setSelectedMetric(metric);
                            setActiveBarIndex(null);
                          }}
                        >
                          <Text style={[
                            styles.segmentBtnText, 
                            { 
                              color: selectedMetric === metric ? theme.text : theme.textSecondary,
                              fontWeight: selectedMetric === metric ? '700' : '600'
                            }
                          ]}>
                            {metric === 'weight' ? 'Peso' : metric.charAt(0).toUpperCase() + metric.slice(1)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    {/* Custom Interactive Column Chart */}
                    <View style={[styles.chartCard, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
                      
                      {/* Interactive Tooltip showing complete records for selected bar */}
                      <View style={[styles.tooltipContainer, { backgroundColor: theme.backgroundSelected }]}>
                        {activeLog ? (
                          <View style={styles.tooltipContent}>
                            <Text style={[styles.tooltipDate, { color: theme.text }]}>Registro: {formatDateDisplay(activeLog.date)}</Text>
                            <View style={styles.tooltipMetricsGrid}>
                              <Text style={[styles.tooltipMetric, { color: brandColors.primary }]}>Peso: {activeLog.weight} kg</Text>
                              <Text style={[styles.tooltipMetric, { color: brandColors.secondary }]}>Cintura: {activeLog.cintura} cm</Text>
                              <Text style={[styles.tooltipMetric, { color: brandColors.accent }]}>Pecho: {activeLog.pecho} cm</Text>
                              <Text style={[styles.tooltipMetric, { color: brandColors.info }]}>Cadera: {activeLog.cadera} cm</Text>
                            </View>
                          </View>
                        ) : (
                          <Text style={[styles.tooltipPlaceholder, { color: theme.textSecondary }]}>
                            Toca una de las barras para ver el detalle de las medidas completas.
                          </Text>
                        )}
                      </View>

                      {/* Chart Grid and Bars */}
                      <View style={styles.chartVisualArea}>
                        {/* Y-Axis guide lines */}
                        <View style={styles.chartGridLines}>
                          <View style={[styles.gridLine, { borderBottomColor: theme.backgroundSelected }]} />
                          <View style={[styles.gridLine, { borderBottomColor: theme.backgroundSelected }]} />
                          <View style={[styles.gridLine, { borderBottomColor: theme.backgroundSelected }]} />
                        </View>

                        {/* Columns Container */}
                        <View style={styles.barsContainer}>
                          {chartData.map((log, index) => {
                            const val = log[selectedMetric];
                            const heightPercent = chartMax === chartMin 
                              ? 50 
                              : ((val - chartMin) / (chartMax - chartMin)) * 80 + 10; // offset between 10% and 90%
                            const color = getMetricColor(selectedMetric);
                            const isActive = activeBarIndex === index;

                            return (
                              <Pressable 
                                key={log.id} 
                                style={[styles.chartBarCol, { width: `${100 / chartData.length}%` }]}
                                onPress={() => setActiveBarIndex(index)}
                              >
                                <View style={styles.barWrapper}>
                                  {/* Bar Value text */}
                                  <Text style={[
                                    styles.barValueText, 
                                    { color: isActive ? color : theme.textSecondary }
                                  ]}>
                                    {val}
                                  </Text>

                                  {/* Bar Column representation */}
                                  <View style={[
                                    styles.barColumn, 
                                    { 
                                      height: `${heightPercent}%`, 
                                      backgroundColor: color,
                                      opacity: isActive ? 1 : 0.6,
                                      shadowColor: color,
                                      shadowOpacity: isActive ? 0.8 : 0,
                                      shadowRadius: 6,
                                    }
                                  ]}>
                                    {/* Neon Top Dot indicator */}
                                    <View style={[styles.barTopDot, { backgroundColor: '#ffffff' }]} />
                                  </View>
                                </View>

                                {/* Date Label */}
                                <Text style={[
                                  styles.barDateLabel, 
                                  { color: isActive ? theme.text : theme.textSecondary }
                                ]}>
                                  {formatDateDisplay(log.date)}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>

                      {/* Info / Legend */}
                      <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                          <View style={[styles.legendColorDot, { backgroundColor: getMetricColor(selectedMetric) }]} />
                          <Text style={[styles.legendText, { color: theme.text }]}>Evolución: {getMetricLabel(selectedMetric)}</Text>
                        </View>
                      </View>

                    </View>
                  </>
                )}
              </View>
            )}

            {activeTab === 'fotos' && (
              <View style={styles.galleryContainer}>
                <Text style={[styles.chartTitle, { color: theme.text }]}>Galería de Progreso</Text>
                
                {allPhotos.length === 0 ? (
                  <View style={styles.emptyGallery}>
                    <SymbolView 
                      name={{ ios: 'photo.fill', android: 'photo', web: 'image' }} 
                      size={48} 
                      tintColor={theme.backgroundSelected} 
                    />
                    <Text style={[styles.emptyText, { color: theme.textSecondary, marginTop: Spacing.two }]}>
                      Aún no has añadido fotos a tus registros. Puedes agregar fotos en la pestaña de registrar.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.photoGrid}>
                    {allPhotos.map((item, idx) => (
                      <View key={idx} style={[styles.photoCard, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
                        <Image source={{ uri: item.url }} style={styles.galleryImage} resizeMode="cover" />
                        <View style={styles.photoDateBadge}>
                          <Text style={styles.photoDateText}>{formatDateDisplay(item.date)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? Spacing.four : 0,
  },
  modalContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    height: Platform.OS === 'web' ? '90%' : '100%',
    borderRadius: Platform.OS === 'web' ? Spacing.three : 0,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: Spacing.one,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  formContainer: {
    gap: Spacing.three,
  },
  formSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  inputGroup: {
    gap: Spacing.two,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  formInput: {
    height: 48,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    fontWeight: '600',
  },
  gridFields: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  photoUploadContainer: {
    marginTop: Spacing.one,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: Spacing.two,
  },
  removePhotoBtn: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
  },
  removePhotoText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  photoButtonsCol: {
    gap: Spacing.two,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    gap: Spacing.two,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  templateText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  silhouetteRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  silhouetteChip: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    gap: Spacing.one,
  },
  silhouetteThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  silhouetteLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  saveBtn: {
    height: 52,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  saveBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
  },
  successBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
    borderRadius: Spacing.three,
    borderWidth: 1,
    gap: Spacing.two,
    marginVertical: Spacing.six,
  },
  successText: {
    fontSize: 16,
    fontWeight: '800',
  },
  chartsContainer: {
    gap: Spacing.three,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.one,
  },
  metricSegmentRow: {
    flexDirection: 'row',
    borderRadius: Spacing.two,
    padding: Spacing.half,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  segmentBtnText: {
    fontSize: 12,
  },
  chartCard: {
    borderRadius: Spacing.four,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  tooltipContainer: {
    padding: Spacing.two,
    borderRadius: Spacing.two,
    minHeight: 50,
    justifyContent: 'center',
  },
  tooltipContent: {
    gap: Spacing.half,
  },
  tooltipDate: {
    fontSize: 12,
    fontWeight: '700',
  },
  tooltipMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tooltipMetric: {
    fontSize: 11,
    fontWeight: '800',
  },
  tooltipPlaceholder: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  chartVisualArea: {
    height: 180,
    position: 'relative',
    marginTop: Spacing.two,
  },
  chartGridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  gridLine: {
    borderBottomWidth: 1,
    height: 0,
    width: '100%',
    opacity: 0.3,
  },
  barsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  chartBarCol: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: Spacing.one,
  },
  barValueText: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: Spacing.half,
  },
  barColumn: {
    width: 14,
    borderRadius: 7,
    position: 'relative',
  },
  barTopDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  barDateLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  legendColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  galleryContainer: {
    gap: Spacing.three,
  },
  emptyGallery: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  photoCard: {
    width: '30%',
    minWidth: 100,
    aspectRatio: 1,
    borderRadius: Spacing.two,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  photoDateBadge: {
    position: 'absolute',
    bottom: Spacing.one,
    left: Spacing.one,
    right: Spacing.one,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    borderRadius: Spacing.half,
    alignItems: 'center',
  },
  photoDateText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
