import { TeamMember, Assignment, Plan, Gender, RunMode } from '../types';
import { DEKA_EXERCISES, getExerciseById } from '../data/exercises';

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/** Create a new team member with defaults */
export const createTeamMember = (
  name: string,
  gender: Gender = 'female',
  strengthWeight = 50,
  cardioCapacity = 50
): TeamMember => ({
  id: `member-${generateId()}`,
  name: name.trim() || 'Team Member',
  gender,
  strengthWeight: Math.max(0, Math.min(100, strengthWeight)),
  cardioCapacity: Math.max(0, Math.min(100, cardioCapacity)),
});

/** Generate an optimized plan based on team member preferences */
export const generatePlan = (teamMembers: TeamMember[], runMode: RunMode = 'both'): Plan => {
  if (teamMembers.length === 0) throw new Error('At least one team member is required');

  const exercises = [...DEKA_EXERCISES].sort((a, b) => a.zone - b.zone);
  const assignments: Assignment[] = [];
  const workloads = teamMembers.map((m) => ({
    memberId: m.id,
    strength: 0,
    cardio: 0,
    running: 0,
    total: 0,
  }));

  let runAlternateIndex = 0;

  let order = 1;

  for (const exercise of exercises) {
    // Running exercises - handle based on runMode
    if (exercise.isRunning) {
      if (runMode === 'both' || teamMembers.length === 1 || exercise.isShared) {
        // Both members run together
        teamMembers.forEach((m) => {
          assignments.push({ exerciseId: exercise.id, memberId: m.id, order });
          const w = workloads.find((x) => x.memberId === m.id)!;
          w.total++;
          w.cardio++;
          w.running++;
        });
      } else if (runMode === 'alternate') {
        // Alternate between members
        const selectedMember = teamMembers[runAlternateIndex % teamMembers.length];
        assignments.push({ exerciseId: exercise.id, memberId: selectedMember.id, order });
        const w = workloads.find((x) => x.memberId === selectedMember.id)!;
        w.total++;
        w.cardio++;
        w.running++;
        runAlternateIndex++;
      } else if (runMode === 'stronger') {
        // Assign to member with higher cardio capacity, weighted by remaining workload
        const selectedMember = selectRunnerByCapacity(teamMembers, workloads);
        assignments.push({ exerciseId: exercise.id, memberId: selectedMember, order });
        const w = workloads.find((x) => x.memberId === selectedMember)!;
        w.total++;
        w.cardio++;
        w.running++;
      }
      order++;
      continue;
    }

    // Non-running shared exercises
    if (exercise.isShared) {
      teamMembers.forEach((m) => {
        assignments.push({ exerciseId: exercise.id, memberId: m.id, order });
        const w = workloads.find((x) => x.memberId === m.id)!;
        w.total++;
        if (exercise.type === 'cardio') w.cardio++;
        else w.strength++;
      });
      order++;
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
    runMode,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

/** Select runner based on cardio capacity and current workload */
const selectRunnerByCapacity = (
  members: TeamMember[],
  workloads: { memberId: string; running: number; cardio: number; total: number }[]
): string => {
  // Weight the selection by cardio capacity and inverse of current running load
  const scored = members.map((m) => {
    const w = workloads.find((x) => x.memberId === m.id)!;
    // Higher cardio capacity = more runs, but balance with current load
    const capacityScore = m.cardioCapacity / 100;
    const loadPenalty = w.running * 0.1; // Slight penalty for each run already assigned
    return { memberId: m.id, score: capacityScore - loadPenalty };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].memberId;
};

/** Select optimal member based on preference, cardio capacity, and current workload */
const selectOptimalMember = (
  members: TeamMember[],
  workloads: { memberId: string; strength: number; cardio: number; running: number; total: number }[],
  type: 'strength' | 'cardio'
): string => {
  const sorted = [...members].sort((a, b) => {
    const wa = workloads.find((w) => w.memberId === a.id)!;
    const wb = workloads.find((w) => w.memberId === b.id)!;

    const ratioA = wa.total > 0 ? (type === 'strength' ? wa.strength : wa.cardio) / wa.total : 0;
    const ratioB = wb.total > 0 ? (type === 'strength' ? wb.strength : wb.cardio) / wb.total : 0;

    // For strength: use strength preference
    // For cardio: combine cardio preference with cardio capacity for overall bias
    let prefA: number, prefB: number;
    if (type === 'strength') {
      prefA = a.strengthWeight / 100;
      prefB = b.strengthWeight / 100;
    } else {
      // Cardio preference from slider + cardio capacity bias (weighted 60/40)
      const cardioSliderA = (100 - a.strengthWeight) / 100;
      const cardioSliderB = (100 - b.strengthWeight) / 100;
      const capacityA = a.cardioCapacity / 100;
      const capacityB = b.cardioCapacity / 100;
      prefA = cardioSliderA * 0.5 + capacityA * 0.5;
      prefB = cardioSliderB * 0.5 + capacityB * 0.5;
    }

    const scoreA = prefA - ratioA;
    const scoreB = prefB - ratioB;

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
