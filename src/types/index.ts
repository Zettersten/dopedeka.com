export type ExerciseType = 'strength' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  zone: number;
  description: string;
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
