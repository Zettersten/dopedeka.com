import { TeamMember, Assignment, Plan, Gender } from '../types';
import { DEKA_EXERCISES, getExerciseById } from '../data/exercises';

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/** Create a new team member with defaults */
export const createTeamMember = (
  name: string,
  gender: Gender = 'female',
  strengthWeight = 50,
  fitnessLevel = 50
): TeamMember => ({
  id: `member-${generateId()}`,
  name: name.trim() || 'Team Member',
  gender,
  strengthWeight: Math.max(0, Math.min(100, strengthWeight)),
  fitnessLevel: Math.max(0, Math.min(100, fitnessLevel)),
});

/** Generate an optimized plan based on team member preferences */
export const generatePlan = (teamMembers: TeamMember[]): Plan => {
  if (teamMembers.length === 0) throw new Error('At least one team member is required');

  const exercises = [...DEKA_EXERCISES].sort((a, b) => a.zone - b.zone);
  const assignments: Assignment[] = [];
  const workloads = teamMembers.map((m) => ({
    memberId: m.id,
    strength: 0,
    cardio: 0,
    total: 0,
  }));

  let order = 1;

  for (const exercise of exercises) {
    // Shared exercises (like final run) assigned to all members
    if (exercise.isShared) {
      teamMembers.forEach((m) => {
        assignments.push({ exerciseId: exercise.id, memberId: m.id, order });
        const w = workloads.find((x) => x.memberId === m.id)!;
        w.total++;
        w.cardio++;
      });
      order++;
      continue;
    }

    // Running exercises - assign to one member (whoever has less cardio work)
    if (exercise.isRunning) {
      const selectedId = selectOptimalMember(teamMembers, workloads, 'cardio');
      assignments.push({ exerciseId: exercise.id, memberId: selectedId, order: order++ });
      const w = workloads.find((x) => x.memberId === selectedId)!;
      w.total++;
      w.cardio++;
      continue;
    }

    // Single member - assign everything
    if (teamMembers.length === 1) {
      assignments.push({ exerciseId: exercise.id, memberId: teamMembers[0].id, order: order++ });
      continue;
    }

    // Multi-member: optimize assignment based on preferences
    const selectedId = selectOptimalMember(teamMembers, workloads, exercise.type);

    assignments.push({ exerciseId: exercise.id, memberId: selectedId, order: order++ });

    const w = workloads.find((x) => x.memberId === selectedId)!;
    w.total++;
    if (exercise.type === 'strength') w.strength++;
    else w.cardio++;
  }

  return {
    id: `plan-${generateId()}`,
    teamMembers: [...teamMembers],
    assignments,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

/** Select optimal member based on preference, fitness level, and current workload */
const selectOptimalMember = (
  members: TeamMember[],
  workloads: { memberId: string; strength: number; cardio: number; total: number }[],
  type: 'strength' | 'cardio'
): string => {
  const sorted = [...members].sort((a, b) => {
    const wa = workloads.find((w) => w.memberId === a.id)!;
    const wb = workloads.find((w) => w.memberId === b.id)!;

    const ratioA = wa.total > 0 ? (type === 'strength' ? wa.strength : wa.cardio) / wa.total : 0;
    const ratioB = wb.total > 0 ? (type === 'strength' ? wb.strength : wb.cardio) / wb.total : 0;

    const prefA = type === 'strength' ? a.strengthWeight / 100 : (100 - a.strengthWeight) / 100;
    const prefB = type === 'strength' ? b.strengthWeight / 100 : (100 - b.strengthWeight) / 100;

    // Fitness level influences overall workload capacity
    // Higher fitness = can take more exercises
    const fitnessA = a.fitnessLevel / 100;
    const fitnessB = b.fitnessLevel / 100;

    // Score combines preference match and fitness-adjusted workload
    const scoreA = prefA - ratioA + (fitnessA * 0.3);
    const scoreB = prefB - ratioB + (fitnessB * 0.3);

    return Math.abs(scoreA - scoreB) < 0.1 ? wa.total - wb.total : scoreB - scoreA;
  });

  return sorted[0].id;
};

/** Update a single assignment's member */
export const updatePlanAssignments = (plan: Plan, exerciseId: string, newMemberId: string): Plan => ({
  ...plan,
  assignments: plan.assignments.map((a) =>
    a.exerciseId === exerciseId ? { ...a, memberId: newMemberId } : a
  ),
  updatedAt: Date.now(),
});

/** Split an exercise among team members */
export const splitExercise = (plan: Plan, exerciseId: string, splitCount: number): Plan => {
  const exercise = getExerciseById(exerciseId);
  if (!exercise?.splittable) return plan;

  const original = plan.assignments.find((a) => a.exerciseId === exerciseId && !a.parentExerciseId);
  if (!original) return plan;

  const filtered = plan.assignments.filter((a) => a.exerciseId !== exerciseId);
  const fraction = 1 / splitCount;

  for (let i = 0; i < splitCount; i++) {
    filtered.push({
      exerciseId,
      memberId: plan.teamMembers[i % plan.teamMembers.length].id,
      order: original.order,
      splitFraction: fraction,
      parentExerciseId: exerciseId,
      splitIndex: i,
    });
  }

  filtered.sort((a, b) => (a.order !== b.order ? a.order - b.order : (a.splitIndex ?? 0) - (b.splitIndex ?? 0)));

  return { ...plan, assignments: filtered, updatedAt: Date.now() };
};

/** Swap assignments between two exercises */
export const swapExercises = (plan: Plan, id1: string, id2: string): Plan => {
  const a1 = plan.assignments.find((a) => a.exerciseId === id1 && !a.parentExerciseId);
  const a2 = plan.assignments.find((a) => a.exerciseId === id2 && !a.parentExerciseId);
  if (!a1 || !a2) return plan;

  const ex1 = getExerciseById(id1);
  const ex2 = getExerciseById(id2);
  if (ex1?.isRunning || ex2?.isRunning) return plan;

  return {
    ...plan,
    assignments: plan.assignments.map((a) => {
      if (a.exerciseId === id1 && !a.parentExerciseId) return { ...a, memberId: a2.memberId };
      if (a.exerciseId === id2 && !a.parentExerciseId) return { ...a, memberId: a1.memberId };
      return a;
    }),
    updatedAt: Date.now(),
  };
};

/** Reassign an exercise from one member to another */
export const reassignExercise = (
  plan: Plan,
  exerciseId: string,
  fromMemberId: string,
  toMemberId: string
): Plan => {
  const exercise = getExerciseById(exerciseId);
  if (exercise?.isRunning) return plan;

  return {
    ...plan,
    assignments: plan.assignments.map((a) =>
      a.exerciseId === exerciseId && a.memberId === fromMemberId ? { ...a, memberId: toMemberId } : a
    ),
    updatedAt: Date.now(),
  };
};

/** Get all assignments for a specific member */
export const getMemberAssignments = (plan: Plan, memberId: string): Assignment[] =>
  plan.assignments.filter((a) => a.memberId === memberId).sort((a, b) => a.order - b.order);

/** Calculate statistics for each team member */
export const getExerciseStats = (plan: Plan) =>
  plan.teamMembers.map((member) => {
    const assignments = getMemberAssignments(plan, member.id);
    const strength = assignments.filter((a) => getExerciseById(a.exerciseId)?.type === 'strength').length;
    const cardio = assignments.filter((a) => getExerciseById(a.exerciseId)?.type === 'cardio').length;

    return {
      memberId: member.id,
      memberName: member.name,
      gender: member.gender,
      totalExercises: assignments.length,
      strengthExercises: strength,
      cardioExercises: cardio,
      strengthPercentage: assignments.length > 0 ? Math.round((strength / assignments.length) * 100) : 0,
    };
  });

/** Get ordered list of plan items for timeline view */
export const getPlanTimeline = (plan: Plan) => {
  const grouped = new Map<number, Assignment[]>();
  
  for (const a of plan.assignments) {
    const existing = grouped.get(a.order) ?? [];
    existing.push(a);
    grouped.set(a.order, existing);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([order, assignments]) => ({
      order,
      exercise: getExerciseById(assignments[0].exerciseId)!,
      assignments: assignments.sort((a, b) => (a.splitIndex ?? 0) - (b.splitIndex ?? 0)),
    }));
};
