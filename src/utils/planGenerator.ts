import { TeamMember, Assignment, Plan } from '../types';
import { DEKA_EXERCISES } from '../data/exercises';

const generateMemberId = (): string => `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const generatePlanId = (): string => `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const createTeamMember = (name: string, strengthWeight: number = 50): TeamMember => ({
  id: generateMemberId(),
  name: name.trim() || 'Team Member',
  strengthWeight: Math.max(0, Math.min(100, strengthWeight)),
});

export const generatePlan = (teamMembers: TeamMember[]): Plan => {
  if (teamMembers.length === 0) {
    throw new Error('At least one team member is required');
  }

  const allExercises = [...DEKA_EXERCISES].sort((a, b) => a.zone - b.zone);

  const assignments: Assignment[] = [];
  const memberWorkloads = teamMembers.map(member => ({
    memberId: member.id,
    strengthCount: 0,
    cardioCount: 0,
    totalCount: 0,
  }));

  allExercises.forEach((exercise, index) => {
    const exerciseType = exercise.type;
    
    if (teamMembers.length === 1) {
      assignments.push({
        exerciseId: exercise.id,
        memberId: teamMembers[0].id,
        order: index + 1,
      });
      return;
    }

    let selectedMemberId: string;
    
    if (exerciseType === 'strength') {
      const sortedMembers = [...teamMembers].sort((a, b) => {
        const aWorkload = memberWorkloads.find(w => w.memberId === a.id)!;
        const bWorkload = memberWorkloads.find(w => w.memberId === b.id)!;
        
        const aStrengthRatio = aWorkload.totalCount > 0 
          ? aWorkload.strengthCount / aWorkload.totalCount 
          : 0;
        const bStrengthRatio = bWorkload.totalCount > 0 
          ? bWorkload.strengthCount / bWorkload.totalCount 
          : 0;
        
        const aPreference = a.strengthWeight / 100;
        const bPreference = b.strengthWeight / 100;
        
        const aScore = aPreference - aStrengthRatio;
        const bScore = bPreference - bStrengthRatio;
        
        if (Math.abs(aScore - bScore) < 0.1) {
          return aWorkload.totalCount - bWorkload.totalCount;
        }
        
        return bScore - aScore;
      });
      
      selectedMemberId = sortedMembers[0].id;
    } else {
      const sortedMembers = [...teamMembers].sort((a, b) => {
        const aWorkload = memberWorkloads.find(w => w.memberId === a.id)!;
        const bWorkload = memberWorkloads.find(w => w.memberId === b.id)!;
        
        const aCardioRatio = aWorkload.totalCount > 0 
          ? aWorkload.cardioCount / aWorkload.totalCount 
          : 0;
        const bCardioRatio = bWorkload.totalCount > 0 
          ? bWorkload.cardioCount / bWorkload.totalCount 
          : 0;
        
        const aPreference = (100 - a.strengthWeight) / 100;
        const bPreference = (100 - b.strengthWeight) / 100;
        
        const aScore = aPreference - aCardioRatio;
        const bScore = bPreference - bCardioRatio;
        
        if (Math.abs(aScore - bScore) < 0.1) {
          return aWorkload.totalCount - bWorkload.totalCount;
        }
        
        return bScore - aScore;
      });
      
      selectedMemberId = sortedMembers[0].id;
    }

    assignments.push({
      exerciseId: exercise.id,
      memberId: selectedMemberId,
      order: index + 1,
    });

    const workload = memberWorkloads.find(w => w.memberId === selectedMemberId)!;
    workload.totalCount++;
    if (exerciseType === 'strength') {
      workload.strengthCount++;
    } else {
      workload.cardioCount++;
    }
  });

  return {
    id: generatePlanId(),
    teamMembers: [...teamMembers],
    assignments,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

export const updatePlanAssignments = (
  plan: Plan,
  exerciseId: string,
  newMemberId: string
): Plan => {
  const updatedAssignments = plan.assignments.map(assignment =>
    assignment.exerciseId === exerciseId
      ? { ...assignment, memberId: newMemberId }
      : assignment
  );

  return {
    ...plan,
    assignments: updatedAssignments,
    updatedAt: Date.now(),
  };
};

export const getMemberAssignments = (plan: Plan, memberId: string): Assignment[] => {
  return plan.assignments
    .filter(assignment => assignment.memberId === memberId)
    .sort((a, b) => a.order - b.order);
};

export const getExerciseStats = (plan: Plan) => {
  const stats = plan.teamMembers.map(member => {
    const assignments = getMemberAssignments(plan, member.id);
    const strengthCount = assignments.filter(a => {
      const exercise = DEKA_EXERCISES.find(e => e.id === a.exerciseId);
      return exercise?.type === 'strength';
    }).length;
    const cardioCount = assignments.filter(a => {
      const exercise = DEKA_EXERCISES.find(e => e.id === a.exerciseId);
      return exercise?.type === 'cardio';
    }).length;

    return {
      memberId: member.id,
      memberName: member.name,
      totalExercises: assignments.length,
      strengthExercises: strengthCount,
      cardioExercises: cardioCount,
      strengthPercentage: assignments.length > 0 
        ? Math.round((strengthCount / assignments.length) * 100) 
        : 0,
    };
  });

  return stats;
};
