import { Exercise, Gender } from '../types';

/**
 * DEKA MILE 2025 Official Exercises
 * Based on official DEKA Rules of Competition v2025
 * Includes 10 stations with runs between each
 */
export const DEKA_EXERCISES: Exercise[] = [
  {
    id: 'run-start',
    name: 'Run',
    type: 'cardio',
    zone: 0,
    distance: '0.1 mile',
    description: 'Starting run - can be done by one or both team members',
    isRunning: true,
    splittable: false,
  },
  {
    id: '1',
    name: 'RAM Lunges',
    type: 'strength',
    zone: 1,
    reps: 30,
    weight: { male: '33lb', female: '22lb' },
    equipment: 'RAM Roller',
    description: '30 alternating reverse lunges with RAM overhead',
    splittable: true,
  },
  {
    id: 'run-1',
    name: 'Run',
    type: 'cardio',
    zone: 1.5,
    distance: '0.1 mile',
    description: 'Transition run',
    isRunning: true,
    splittable: false,
  },
  {
    id: '2',
    name: 'Row',
    type: 'cardio',
    zone: 2,
    distance: '500m',
    description: '500 meter row on Concept2 rower',
    splittable: true,
  },
  {
    id: 'run-2',
    name: 'Run',
    type: 'cardio',
    zone: 2.5,
    distance: '0.1 mile',
    description: 'Transition run',
    isRunning: true,
    splittable: false,
  },
  {
    id: '3',
    name: 'Box Step Overs',
    type: 'cardio',
    zone: 3,
    reps: 20,
    equipment: '24" box',
    description: '20 box step overs on 24-inch box',
    splittable: true,
  },
  {
    id: 'run-3',
    name: 'Run',
    type: 'cardio',
    zone: 3.5,
    distance: '0.1 mile',
    description: 'Transition run',
    isRunning: true,
    splittable: false,
  },
  {
    id: '4',
    name: 'Med Ball Sit-Ups',
    type: 'strength',
    zone: 4,
    reps: 25,
    weight: { male: '20lb', female: '14lb' },
    equipment: 'Medicine Ball',
    description: '25 sit-ups touching med ball overhead and to floor',
    splittable: true,
  },
  {
    id: 'run-4',
    name: 'Run',
    type: 'cardio',
    zone: 4.5,
    distance: '0.1 mile',
    description: 'Transition run',
    isRunning: true,
    splittable: false,
  },
  {
    id: '5',
    name: 'Ski Erg',
    type: 'cardio',
    zone: 5,
    distance: '500m',
    description: '500 meter ski on Concept2 SkiErg',
    splittable: true,
  },
  {
    id: 'run-5',
    name: 'Run',
    type: 'cardio',
    zone: 5.5,
    distance: '0.1 mile',
    description: 'Transition run',
    isRunning: true,
    splittable: false,
  },
  {
    id: '6',
    name: 'Farmers Carry',
    type: 'strength',
    zone: 6,
    distance: '100m',
    weight: { male: '70lb each', female: '40lb each' },
    equipment: 'Kettlebells',
    description: '100 meter carry with kettlebells in each hand',
    splittable: true,
  },
  {
    id: 'run-6',
    name: 'Run',
    type: 'cardio',
    zone: 6.5,
    distance: '0.1 mile',
    description: 'Transition run',
    isRunning: true,
    splittable: false,
  },
  {
    id: '7',
    name: 'Air Bike',
    type: 'cardio',
    zone: 7,
    reps: '25 Cal',
    description: '25 calories on Assault Air Bike',
    splittable: true,
  },
  {
    id: 'run-7',
    name: 'Run',
    type: 'cardio',
    zone: 7.5,
    distance: '0.1 mile',
    description: 'Transition run',
    isRunning: true,
    splittable: false,
  },
  {
    id: '8',
    name: 'Ball Shoulder Overs',
    type: 'strength',
    zone: 8,
    reps: 20,
    weight: { male: '70lb', female: '40lb' },
    equipment: 'D-Ball',
    description: '20 ball shoulder-to-shoulder movements',
    splittable: true,
  },
  {
    id: 'run-8',
    name: 'Run',
    type: 'cardio',
    zone: 8.5,
    distance: '0.1 mile',
    description: 'Transition run',
    isRunning: true,
    splittable: false,
  },
  {
    id: '9',
    name: 'Sled Push/Pull',
    type: 'strength',
    zone: 9,
    distance: '100m',
    weight: { male: '180lb', female: '90lb' },
    equipment: 'Tank Sled',
    description: '50m push + 50m pull with sled',
    splittable: true,
  },
  {
    id: 'run-9',
    name: 'Run',
    type: 'cardio',
    zone: 9.5,
    distance: '0.1 mile',
    description: 'Final transition run - both together',
    isRunning: true,
    isShared: true,
  },
  {
    id: '10',
    name: 'RAM Burpees',
    type: 'strength',
    zone: 10,
    reps: 20,
    weight: { male: '33lb', female: '22lb' },
    equipment: 'RAM Roller',
    description: '20 burpees with RAM overhead press at top',
    splittable: true,
  },
];

/** Get exercises by type */
export const getExercisesByType = (type: 'strength' | 'cardio'): Exercise[] =>
  DEKA_EXERCISES.filter((ex) => ex.type === type);

/** Get exercise by ID */
export const getExerciseById = (id: string): Exercise | undefined =>
  DEKA_EXERCISES.find((ex) => ex.id === id);

/** Get only station exercises (non-running) */
export const getStationExercises = (): Exercise[] =>
  DEKA_EXERCISES.filter((ex) => !ex.isRunning);

/** Get formatted weight for display based on gender */
export const getWeightForGender = (exercise: Exercise, gender: Gender): string =>
  exercise.weight?.[gender] ?? '';

/** Get exercise display name with reps/distance */
export const getExerciseDisplayName = (exercise: Exercise): string => {
  if (exercise.isRunning) return `${exercise.distance} ${exercise.name}`;
  if (exercise.reps) return `${exercise.reps} ${exercise.name}`;
  if (exercise.distance) return `${exercise.distance} ${exercise.name}`;
  return exercise.name;
};

/** Total number of zones/stations */
export const TOTAL_STATIONS = 10;
