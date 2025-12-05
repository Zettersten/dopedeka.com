export type ExerciseType = 'strength' | 'cardio';
export type Gender = 'male' | 'female';

/** Weight specification supporting gender-based requirements */
export interface WeightSpec {
  male: string;
  female: string;
}

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  zone: number;
  reps?: number | string;
  distance?: string;
  weight?: WeightSpec;
  equipment?: string;
  description: string;
  splittable?: boolean;
  isRunning?: boolean;
  isShared?: boolean; // Both team members must complete together
}

export interface TeamMember {
  id: string;
  name: string;
  gender: Gender;
  strengthWeight: number;
}

export interface Assignment {
  exerciseId: string;
  memberId: string;
  order: number;
  splitFraction?: number;
  parentExerciseId?: string;
  splitIndex?: number;
}

export interface Plan {
  id: string;
  teamMembers: TeamMember[];
  assignments: Assignment[];
  createdAt: number;
  updatedAt: number;
}

export interface ExerciseZone {
  zone: number;
  exercises: Exercise[];
}

export type ViewMode = 'cards' | 'timeline';
