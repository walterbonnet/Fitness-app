export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Brazos' | 'Core';
  equipment: 'Barra' | 'Mancuernas' | 'Máquina' | 'Peso Corporal' | 'Poleas';
  instructions: string[];
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  description: string;
  secondaryMuscles: string[];
  benefits: string[];
}

export interface SetGroup {
  setNumber: number;
  weight: number; // in kg
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: SetGroup[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  volumeKg: number;
  exercisesCount: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  description: string;
  exercises: {
    exerciseId: string;
    defaultSets: {
      weight: number;
      reps: number;
    }[];
  }[];
}

export const MOCK_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 't-torso',
    title: 'Torso',
    description: 'Enfoque en pecho, espalda y hombros para un torso equilibrado y fuerte.',
    exercises: [
      {
        exerciseId: '1', // Press de Banca con Barra
        defaultSets: [
          { weight: 60, reps: 8 },
          { weight: 60, reps: 8 },
          { weight: 60, reps: 8 }
        ]
      },
      {
        exerciseId: '4', // Remo con Barra para Espalda
        defaultSets: [
          { weight: 50, reps: 10 },
          { weight: 50, reps: 10 },
          { weight: 50, reps: 10 }
        ]
      },
      {
        exerciseId: '7', // Press Militar con Mancuernas
        defaultSets: [
          { weight: 14, reps: 10 },
          { weight: 14, reps: 10 },
          { weight: 14, reps: 10 }
        ]
      },
      {
        exerciseId: '3', // Dominadas Pronas
        defaultSets: [
          { weight: 0, reps: 8 },
          { weight: 0, reps: 8 },
          { weight: 0, reps: 8 }
        ]
      }
    ]
  },
  {
    id: 't-pierna',
    title: 'Pierna',
    description: 'Desarrollo de fuerza y volumen en cuádriceps, femorales y core.',
    exercises: [
      {
        exerciseId: '5', // Sentadillas con Barra Back Squat
        defaultSets: [
          { weight: 70, reps: 8 },
          { weight: 70, reps: 8 },
          { weight: 70, reps: 8 },
          { weight: 70, reps: 8 }
        ]
      },
      {
        exerciseId: '6', // Peso Muerto Rumano con Barra
        defaultSets: [
          { weight: 60, reps: 10 },
          { weight: 60, reps: 10 },
          { weight: 60, reps: 10 }
        ]
      },
      {
        exerciseId: '11', // Plancha Abdominal Dinámica
        defaultSets: [
          { weight: 0, reps: 60 },
          { weight: 0, reps: 60 },
          { weight: 0, reps: 60 }
        ]
      }
    ]
  },
  {
    id: 't-push',
    title: 'Push (Empuje)',
    description: 'Rutina enfocada en pecho, hombros anteriores y tríceps.',
    exercises: [
      {
        exerciseId: '1', // Press de Banca con Barra
        defaultSets: [
          { weight: 60, reps: 8 },
          { weight: 60, reps: 8 },
          { weight: 60, reps: 8 }
        ]
      },
      {
        exerciseId: '7', // Press Militar con Mancuernas
        defaultSets: [
          { weight: 14, reps: 10 },
          { weight: 14, reps: 10 },
          { weight: 14, reps: 10 }
        ]
      },
      {
        exerciseId: '2', // Aperturas con Mancuernas
        defaultSets: [
          { weight: 12, reps: 12 },
          { weight: 12, reps: 12 },
          { weight: 12, reps: 12 }
        ]
      },
      {
        exerciseId: '10', // Extensiones de Tríceps en Polea Alta
        defaultSets: [
          { weight: 20, reps: 12 },
          { weight: 20, reps: 12 },
          { weight: 20, reps: 12 }
        ]
      }
    ]
  },
  {
    id: 't-pull',
    title: 'Pull (Tracción)',
    description: 'Enfocado en la espalda, deltoides posterior y flexores de codo (bíceps).',
    exercises: [
      {
        exerciseId: '3', // Dominadas Pronas
        defaultSets: [
          { weight: 0, reps: 8 },
          { weight: 0, reps: 8 },
          { weight: 0, reps: 8 }
        ]
      },
      {
        exerciseId: '4', // Remo con Barra para Espalda
        defaultSets: [
          { weight: 50, reps: 10 },
          { weight: 50, reps: 10 },
          { weight: 50, reps: 10 }
        ]
      },
      {
        exerciseId: '9', // Curl de Bíceps Alterno con Mancuernas
        defaultSets: [
          { weight: 12, reps: 12 },
          { weight: 12, reps: 12 },
          { weight: 12, reps: 12 }
        ]
      },
      {
        exerciseId: '12', // Elevaciones de Piernas Colgado
        defaultSets: [
          { weight: 0, reps: 10 },
          { weight: 0, reps: 10 },
          { weight: 0, reps: 10 }
        ]
      }
    ]
  },
  {
    id: 't-fullbody',
    title: 'Full Body',
    description: 'Estímulo completo para todo el cuerpo, ideal para maximizar frecuencia semanal.',
    exercises: [
      {
        exerciseId: '5', // Sentadillas con Barra Back Squat
        defaultSets: [
          { weight: 70, reps: 8 },
          { weight: 70, reps: 8 },
          { weight: 70, reps: 8 }
        ]
      },
      {
        exerciseId: '1', // Press de Banca con Barra
        defaultSets: [
          { weight: 60, reps: 8 },
          { weight: 60, reps: 8 },
          { weight: 60, reps: 8 }
        ]
      },
      {
        exerciseId: '4', // Remo con Barra para Espalda
        defaultSets: [
          { weight: 50, reps: 10 },
          { weight: 50, reps: 10 },
          { weight: 50, reps: 10 }
        ]
      },
      {
        exerciseId: '8', // Elevaciones Laterales con Mancuernas
        defaultSets: [
          { weight: 8, reps: 12 },
          { weight: 8, reps: 12 },
          { weight: 8, reps: 12 }
        ]
      },
      {
        exerciseId: '11', // Plancha Abdominal Dinámica
        defaultSets: [
          { weight: 0, reps: 60 },
          { weight: 0, reps: 60 },
          { weight: 0, reps: 60 }
        ]
      }
    ]
  }
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Press de Banca con Barra',
    muscleGroup: 'Pecho',
    equipment: 'Barra',
    difficulty: 'Intermedio',
    description: 'El ejercicio fundamental de empuje horizontal para desarrollar fuerza y masa muscular en el tren superior.',
    secondaryMuscles: ['Tríceps', 'Hombro Anterior'],
    benefits: ['Fuerza de empuje horizontal', 'Desarrollo de masa pectoral', 'Estabilidad del hombro'],
    instructions: [
      'Acuéstate en un banco plano con los ojos directamente debajo de la barra.',
      'Sujeta la barra con las manos ligeramente más abiertas que el ancho de los hombros.',
      'Desengancha la barra y bájala lentamente hacia el medio de tu pecho.',
      'Empuja la barra hacia arriba con fuerza hasta que los brazos estén completamente extendidos.'
    ]
  },
  {
    id: '2',
    name: 'Aperturas con Mancuernas',
    muscleGroup: 'Pecho',
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    description: 'Ejercicio de aislamiento pectoral que estira profundamente las fibras musculares sin involucrar activamente al tríceps.',
    secondaryMuscles: ['Deltoides Anterior'],
    benefits: ['Aislamiento del pectoral', 'Estiramiento fascial profundo', 'Bajo impacto en codos'],
    instructions: [
      'Acuéstate en un banco plano con una mancuerna en cada mano sobre tu pecho.',
      'Con los codos ligeramente doblados, abre los brazos hacia los lados dibujando un arco amplio.',
      'Baja hasta sentir un estiramiento cómodo en el pecho.',
      'Utiliza los pectorales para regresar las mancuernas a la posición inicial en un movimiento de abrazo.'
    ]
  },
  {
    id: '3',
    name: 'Dominadas Pronas (Pull-ups)',
    muscleGroup: 'Espalda',
    equipment: 'Peso Corporal',
    difficulty: 'Avanzado',
    description: 'Movimiento rey de tracción vertical para lograr una espalda ancha y en forma de "V".',
    secondaryMuscles: ['Bíceps', 'Braquial', 'Antebrazo', 'Core'],
    benefits: ['Espalda en V', 'Fuerza de agarre funcional', 'Control del propio peso corporal'],
    instructions: [
      'Sujeta la barra de dominadas con las palmas mirando hacia afuera, al ancho de los hombros.',
      'Mantén el core apretado y los hombros hacia atrás.',
      'Tira de tu cuerpo hacia arriba liderando con el pecho, hasta que tu barbilla pase la barra.',
      'Baja de manera controlada hasta que los brazos estén completamente extendidos.'
    ]
  },
  {
    id: '4',
    name: 'Remo con Barra para Espalda',
    muscleGroup: 'Espalda',
    equipment: 'Barra',
    difficulty: 'Intermedio',
    description: 'Ejercicio compuesto de tracción horizontal esencial para otorgar densidad y grosor al torso superior.',
    secondaryMuscles: ['Bíceps', 'Deltoides Posterior', 'Trapecios', 'Lumbares'],
    benefits: ['Grosor de espalda', 'Estabilización lumbar', 'Corrección postural'],
    instructions: [
      'Sujeta la barra con agarre prono y flexiona ligeramente las rodillas.',
      'Inclina el torso hacia adelante unos 45 grados manteniendo la espalda completamente recta.',
      'Tira de la barra hacia la parte baja de tu abdomen, llevando los codos pegados a los costados.',
      'Extiende los brazos lentamente para regresar a la posición inicial.'
    ]
  },
  {
    id: '5',
    name: 'Sentadillas con Barra Back Squat',
    muscleGroup: 'Piernas',
    equipment: 'Barra',
    difficulty: 'Intermedio',
    description: 'El rey indiscutible del entrenamiento de piernas. Desarrolla cuádriceps, glúteos y estimula el cuerpo entero.',
    secondaryMuscles: ['Femorales', 'Pantorrillas', 'Core', 'Erectores Espinales'],
    benefits: ['Fuerza máxima de piernas', 'Densidad ósea mejorada', 'Aumento de testosterona natural'],
    instructions: [
      'Coloca la barra sobre los trapecios (no en el cuello) y separa los pies al ancho de los hombros.',
      'Mantén el pecho levantado e inicia el movimiento empujando las caderas hacia atrás.',
      'Baja doblando las rodillas hasta que los muslos estén paralelos al suelo o más abajo.',
      'Empuja con los talones para regresar a la posición inicial manteniendo la espalda recta.'
    ]
  },
  {
    id: '6',
    name: 'Peso Muerto Rumano con Barra',
    muscleGroup: 'Piernas',
    equipment: 'Barra',
    difficulty: 'Intermedio',
    description: 'Ejercicio enfocado en la cadena posterior con énfasis en estiramiento y contracción de femorales y glúteos.',
    secondaryMuscles: ['Glúteos', 'Lumbares', 'Fuerza de Agarre'],
    benefits: ['Cadena posterior fuerte', 'Prevención de lesiones en rodilla', 'Flexibilidad en isquiotibiales'],
    instructions: [
      'Párate derecho con una barra al frente tomada con agarre prono.',
      'Manteniendo la espalda recta y rodillas ligeramente flexionadas, empuja tu cadera hacia atrás.',
      'Desliza la barra cerca de tus muslos hacia abajo hasta sentir un estiramiento en la parte posterior.',
      'Empuja la cadera hacia adelante contrayendo los glúteos para regresar arriba.'
    ]
  },
  {
    id: '7',
    name: 'Press Militar con Mancuernas',
    muscleGroup: 'Hombros',
    equipment: 'Mancuernas',
    difficulty: 'Intermedio',
    description: 'Excelente ejercicio multiarticular de empuje vertical para desarrollar hombros fuertes y tridimensionales.',
    secondaryMuscles: ['Tríceps', 'Pectoral Superior', 'Trapecios'],
    benefits: ['Hombros más anchos', 'Estabilidad del core de pie', 'Fuerza de empuje vertical'],
    instructions: [
      'Siéntate en un banco con respaldo levantado y sostén una mancuerna en cada mano a la altura de los hombros.',
      'Las palmas deben mirar hacia el frente y los codos doblados a 90 grados.',
      'Empuja las mancuernas hacia arriba sobre tu cabeza hasta estirar los brazos sin bloquear los codos.',
      'Baja lentamente las mancuernas de regreso a la altura de las orejas.'
    ]
  },
  {
    id: '8',
    name: 'Elevaciones Laterales con Mancuernas',
    muscleGroup: 'Hombros',
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    description: 'Aislamiento para la porción lateral del deltoides. Aumenta la anchura clavicular percibida.',
    secondaryMuscles: ['Trapecios', 'Deltoides Posterior'],
    benefits: ['Hombros en forma de V', 'Estabilidad de hombro', 'Bajo impacto articular'],
    instructions: [
      'Párate derecho con una mancuerna en cada mano a los costados de los muslos.',
      'Dobla levemente los codos y eleva los brazos lateralmente formando un arco.',
      'Sube hasta que tus brazos estén paralelos al suelo con los meñiques ligeramente apuntando al techo.',
      'Baja de forma lenta y controlada sintiendo la tensión.'
    ]
  },
  {
    id: '9',
    name: 'Curl de Bíceps Alterno con Mancuernas',
    muscleGroup: 'Brazos',
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    description: 'El clásico ejercicio para desarrollar el pico del bíceps gracias al giro (supinación) de la muñeca.',
    secondaryMuscles: ['Braquiorradial', 'Antebrazos'],
    benefits: ['Desarrollo completo de bíceps', 'Estética de brazos', 'Fuerza de tracción en agarre'],
    instructions: [
      'Párate derecho con una mancuerna en cada mano, los brazos extendidos y las palmas hacia adentro.',
      'Mantén los codos pegados al torso y flexiona un brazo girando la palma hacia arriba.',
      'Contrae el bíceps en la parte superior y luego baja la mancuerna lentamente.',
      'Repite el movimiento con el brazo contrario de forma alterna.'
    ]
  },
  {
    id: '10',
    name: 'Extensiones de Tríceps en Polea Alta',
    muscleGroup: 'Brazos',
    equipment: 'Poleas',
    difficulty: 'Principiante',
    description: 'Aislamiento para la cabeza lateral y medial de los tríceps con tensión continua a lo largo de todo el rango.',
    secondaryMuscles: ['Deltoides Posterior', 'Core'],
    benefits: ['Tensión continua', 'Definición de tríceps', 'Salud del codo'],
    instructions: [
      'Sujeta la cuerda de la polea alta y da un paso atrás, inclinando el torso levemente.',
      'Mantén los codos pegados a los costados del cuerpo y dobla los brazos a 90 grados.',
      'Empuja la cuerda hacia abajo extendiendo completamente los brazos y separando los extremos de la cuerda abajo.',
      'Regresa lentamente a la posición inicial manteniendo los codos fijos.'
    ]
  },
  {
    id: '11',
    name: 'Plancha Abdominal Dinámica',
    muscleGroup: 'Core',
    equipment: 'Peso Corporal',
    difficulty: 'Principiante',
    description: 'Ejercicio isométrico rey para entrenar la rigidez del core y proteger la zona lumbar.',
    secondaryMuscles: ['Hombros', 'Glúteos', 'Cuádriceps'],
    benefits: ['Estabilidad lumbar', 'Prevención de dolor de espalda', 'Fuerza de core estática'],
    instructions: [
      'Apoya los antebrazos en el suelo alineando los codos directamente debajo de los hombros.',
      'Extiende las piernas hacia atrás apoyando las puntas de los pies.',
      'Mantén el cuerpo en línea recta desde la cabeza hasta los talones, contrayendo el abdomen y glúteos.',
      'Sostén la posición respirando de manera controlada.'
    ]
  },
  {
    id: '12',
    name: 'Elevaciones de Piernas Colgado',
    muscleGroup: 'Core',
    equipment: 'Peso Corporal',
    difficulty: 'Intermedio',
    description: 'Desarrollo dinámico avanzado para el abdomen inferior y la fuerza de colgado en barra.',
    secondaryMuscles: ['Flexores de Cadera', 'Antebrazo', 'Dorsal Ancho'],
    benefits: ['Fuerza abdominal inferior', 'Descompresión espinal', 'Fuerza de agarre de colgado'],
    instructions: [
      'Cuélgate de una barra de dominadas con los brazos extendidos y el cuerpo relajado.',
      'Manteniendo las piernas estiradas en lo posible, elévalas usando la fuerza del abdomen.',
      'Lleva las piernas hasta formar un ángulo de 90 grados con tu torso.',
      'Desciende las piernas lentamente evitando balancear el cuerpo.'
    ]
  }
];

export const MOCK_HISTORY: WorkoutSession[] = [];

type HistoryListener = (history: WorkoutSession[]) => void;
let historyListeners: HistoryListener[] = [];

export const addWorkoutToHistory = (session: WorkoutSession) => {
  MOCK_HISTORY.unshift(session);
  historyListeners.forEach(listener => listener([...MOCK_HISTORY]));
};

export const subscribeToHistory = (listener: HistoryListener) => {
  historyListeners.push(listener);
  return () => {
    historyListeners = historyListeners.filter(l => l !== listener);
  };
};

export const MOCK_ACTIVE_WORKOUT: WorkoutSession = {
  id: 'active',
  title: 'Nueva Sesión de Entrenamiento',
  date: 'Hoy',
  durationMinutes: 0,
  volumeKg: 0,
  exercisesCount: 0,
  exercises: []
};

let activeWorkout = { ...MOCK_ACTIVE_WORKOUT };
let activeWorkoutListeners: ((w: WorkoutSession) => void)[] = [];

export const getActiveWorkout = () => activeWorkout;

export const updateActiveWorkout = (newWorkout: WorkoutSession) => {
  activeWorkout = { ...newWorkout };
  activeWorkoutListeners.forEach(l => l(activeWorkout));
};

export const subscribeToActiveWorkout = (listener: (w: WorkoutSession) => void) => {
  activeWorkoutListeners.push(listener);
  return () => {
    activeWorkoutListeners = activeWorkoutListeners.filter(l => l !== listener);
  };
};

let restTimerDuration = 90; // Default 90s
let timerListeners: ((d: number) => void)[] = [];

export const getRestTimerDuration = () => restTimerDuration;

export const updateRestTimerDuration = (duration: number) => {
  restTimerDuration = duration;
  timerListeners.forEach(l => l(restTimerDuration));
};

export const subscribeToRestTimerDuration = (listener: (d: number) => void) => {
  timerListeners.push(listener);
  return () => {
    timerListeners = timerListeners.filter(l => l !== listener);
  };
};

export interface ProgressLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  cintura: number; // in cm
  pecho: number; // in cm
  cadera: number; // in cm
  photos: string[]; // base64 strings or local asset paths
}

export const MOCK_PROGRESS: ProgressLog[] = [
  {
    id: 'p1',
    date: '2026-05-01',
    weight: 82.5,
    cintura: 88,
    pecho: 104,
    cadera: 100,
    photos: []
  },
  {
    id: 'p2',
    date: '2026-05-15',
    weight: 81.2,
    cintura: 86,
    pecho: 103,
    cadera: 99,
    photos: []
  },
  {
    id: 'p3',
    date: '2026-06-01',
    weight: 80.0,
    cintura: 84,
    pecho: 102,
    cadera: 98,
    photos: []
  },
  {
    id: 'p4',
    date: '2026-06-15',
    weight: 79.1,
    cintura: 83,
    pecho: 103,
    cadera: 97,
    photos: []
  }
];

let progressListeners: ((logs: ProgressLog[]) => void)[] = [];

export const getProgressLogs = () => MOCK_PROGRESS;

export const addProgressLog = (log: Omit<ProgressLog, 'id'>) => {
  const newLog: ProgressLog = {
    ...log,
    id: `p-${Date.now()}`
  };
  MOCK_PROGRESS.unshift(newLog);
  // Sort descending by date lexicographically
  MOCK_PROGRESS.sort((a, b) => b.date.localeCompare(a.date));
  progressListeners.forEach(l => l([...MOCK_PROGRESS]));
};

export const subscribeToProgress = (listener: (logs: ProgressLog[]) => void) => {
  progressListeners.push(listener);
  return () => {
    progressListeners = progressListeners.filter(l => l !== listener);
  };
};


