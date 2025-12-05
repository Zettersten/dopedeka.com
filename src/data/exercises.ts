import { Exercise } from '../types';

export const DEKA_EXERCISES: Exercise[] = [
  { id: '1', name: '1000m SkiErg', type: 'cardio', zone: 1, description: '1000 meter SkiErg', splittable: true },
  { id: '2', name: '25 Burpee Broad Jumps', type: 'cardio', zone: 2, description: '25 burpee broad jumps' },
  { id: '3', name: '20 Kettlebell Deadlifts', type: 'strength', zone: 3, description: '20 kettlebell deadlifts' },
  { id: '4', name: '500m Row', type: 'cardio', zone: 4, description: '500 meter row', splittable: true },
  { id: '5', name: '20 Thrusters', type: 'strength', zone: 5, description: '20 thrusters' },
  { id: '6', name: '30 Box Step Overs', type: 'cardio', zone: 6, description: '30 box step overs' },
  { id: '7', name: '20 Sandbag Squat Cleans', type: 'strength', zone: 7, description: '20 sandbag squat cleans' },
  { id: '8', name: '1000m Bike', type: 'cardio', zone: 8, description: '1000 meter bike', splittable: true },
  { id: '9', name: '100m Farmers Walk', type: 'strength', zone: 9, description: '100 meter farmers walk' },
  { id: '10', name: '100m Sled Push', type: 'strength', zone: 10, description: '100 meter sled push' },
  { id: 'run-start', name: '0.1 mile Run (Start)', type: 'cardio', zone: 0, description: '0.1 mile run - must start together', isRunning: true },
  { id: 'run-end', name: '0.1 mile Run (End)', type: 'cardio', zone: 11, description: '0.1 mile run - must end together', isRunning: true },
];

export const getExercisesByType = (type: 'strength' | 'cardio'): Exercise[] => {
  return DEKA_EXERCISES.filter(ex => ex.type === type);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return DEKA_EXERCISES.find(ex => ex.id === id);
};

export const getTotalExercises = (): number => DEKA_EXERCISES.length;
