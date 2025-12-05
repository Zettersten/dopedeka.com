export type ExerciseType = 'strength' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  zone: number;
  description: string;
  splittable?: boolean; // Whether this exercise can be split
  isRunning?: boolean; // Whether this is a running exercise (must be done together)
}

export interface TeamMember {
  id: string;
  name: string;
  strengthWeight: number;
}

export interface Assignment {
  exerciseId: string;
  memberId: string;
  order: number;
  splitFraction?: number; // For split exercises: 1/4, 1/3, 1/2, etc.
  parentExerciseId?: string; // If this is a split, reference to original exercise
  splitIndex?: number; // Index of this split (0, 1, 2, etc.)
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
