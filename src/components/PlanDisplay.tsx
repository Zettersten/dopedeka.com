import { Plan } from '../types';
import { getExerciseById } from '../data/exercises';
import { getExerciseStats } from '../utils/planGenerator';
import './PlanDisplay.css';

interface PlanDisplayProps {
  plan: Plan;
  onAssignmentChange: (exerciseId: string, newMemberId: string) => void;
}

export default function PlanDisplay({ plan, onAssignmentChange }: PlanDisplayProps) {
  const stats = getExerciseStats(plan);
  const sortedAssignments = [...plan.assignments].sort((a, b) => a.order - b.order);

  return (
    <div className="plan-display">
      <div className="plan-header">
        <h2>Your DEKA Team Plan</h2>
        <p className="plan-subtitle">Drag exercises between team members to customize your plan</p>
      </div>

      <div className="plan-stats">
        {stats.map((stat) => (
          <div key={stat.memberId} className="stat-card">
            <h3>{stat.memberName}</h3>
            <div className="stat-details">
              <div className="stat-item">
                <span className="stat-label">Total Exercises:</span>
                <span className="stat-value">{stat.totalExercises}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Strength:</span>
                <span className="stat-value">{stat.strengthExercises} ({stat.strengthPercentage}%)</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Cardio:</span>
                <span className="stat-value">{stat.cardioExercises} ({100 - stat.strengthPercentage}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="exercises-list">
        {sortedAssignments.map((assignment) => {
          const exercise = getExerciseById(assignment.exerciseId);
          if (!exercise) return null;

          const exerciseTypeClass = exercise.type === 'strength' ? 'strength' : 'cardio';

          return (
            <div key={assignment.exerciseId} className={`exercise-card ${exerciseTypeClass}`}>
              <div className="exercise-header">
                <div className="exercise-zone">Zone {exercise.zone}</div>
                <div className="exercise-type-badge">{exercise.type}</div>
              </div>
              <h3 className="exercise-name">{exercise.name}</h3>
              <p className="exercise-description">{exercise.description}</p>
              <div className="exercise-assignment">
                <label htmlFor={`assign-${assignment.exerciseId}`} className="assignment-label">
                  Assigned to:
                </label>
                <select
                  id={`assign-${assignment.exerciseId}`}
                  value={assignment.memberId}
                  onChange={(e) => onAssignmentChange(assignment.exerciseId, e.target.value)}
                  className="assignment-select"
                >
                  {plan.teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
