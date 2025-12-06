import { useState } from 'react';
import { Scissors, ArrowLeftRight, UserPlus, X, ChevronDown, Zap, Activity, Users } from 'lucide-react';
import { Plan } from '../types';
import { getExerciseById, getWeightForGender } from '../data/exercises';
import { getExerciseStats } from '../utils/planGenerator';
import './PlanDisplay.css';

interface PlanDisplayProps {
  plan: Plan;
  onAssignmentChange: (exerciseId: string, newMemberId: string) => void;
  onSplit: (exerciseId: string, splitCount: number) => void;
  onSwap: (exerciseId1: string, exerciseId2: string) => void;
  onReassign: (exerciseId: string, fromMemberId: string, toMemberId: string) => void;
}

/** Card-based plan display with exercise management */
export default function PlanDisplay({
  plan,
  onAssignmentChange,
  onSplit,
  onSwap,
  onReassign,
}: PlanDisplayProps) {
  const [splitModal, setSplitModal] = useState<string | null>(null);
  const [swapSource, setSwapSource] = useState<string | null>(null);
  const [reassignSource, setReassignSource] = useState<{ exerciseId: string; memberId: string } | null>(null);

  const stats = getExerciseStats(plan);
  const sortedAssignments = [...plan.assignments].sort((a, b) =>
    a.order !== b.order ? a.order - b.order : (a.splitIndex ?? 0) - (b.splitIndex ?? 0)
  );

  const getMemberColor = (memberId: string) => {
    const idx = plan.teamMembers.findIndex((m) => m.id === memberId);
    return `member-${idx + 1}`;
  };

  const getMemberGender = (memberId: string) =>
    plan.teamMembers.find((m) => m.id === memberId)?.gender ?? 'female';

  const handleSwapClick = (exerciseId: string) => {
    if (!swapSource) {
      setSwapSource(exerciseId);
    } else {
      if (swapSource !== exerciseId) onSwap(swapSource, exerciseId);
      setSwapSource(null);
    }
  };

  const handleReassignClick = (exerciseId: string, memberId: string) => {
    if (!reassignSource) {
      setReassignSource({ exerciseId, memberId });
    } else if (reassignSource.exerciseId === exerciseId && reassignSource.memberId === memberId) {
      setReassignSource(null);
    }
  };

  const getAssignmentKey = (a: (typeof sortedAssignments)[0], _idx?: number) =>
    `${a.exerciseId}-${a.memberId}-${a.splitIndex ?? 0}`;

  const isSplit = (a: (typeof sortedAssignments)[0]) => a.parentExerciseId !== undefined;

  const getSplitSiblings = (a: (typeof sortedAssignments)[0]) =>
    isSplit(a) ? sortedAssignments.filter((x) => x.exerciseId === a.exerciseId && x.parentExerciseId) : [];

  // Group by unique exercise order (to handle splits)
  const seen = new Set<string>();

  return (
    <div className="plan-display">
      {/* Stats Bar */}
      <div className="stats-bar">
        {stats.map((stat) => (
          <div key={stat.memberId} className={`stat-chip ${getMemberColor(stat.memberId)}`}>
            <span className="stat-name">{stat.memberName}</span>
            <div className="stat-badges">
              <span className="badge strength">
                <Zap size={12} /> {stat.strengthExercises}
              </span>
              <span className="badge cardio">
                <Activity size={12} /> {stat.cardioExercises}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Cards */}
      <div className="exercise-list">
        {sortedAssignments.map((assignment, idx) => {
          const exercise = getExerciseById(assignment.exerciseId);
          if (!exercise) return null;

          const assignmentIsSplit = isSplit(assignment);
          const key = `${exercise.id}-${assignment.order}`;
          
          // Skip if we've already rendered this exercise (for splits)
          if (assignmentIsSplit && assignment.splitIndex !== 0) return null;
          if (seen.has(key)) return null;
          seen.add(key);

          const splitSiblings = getSplitSiblings(assignment);
          const member = plan.teamMembers.find((m) => m.id === assignment.memberId);
          const isSwapActive = swapSource === assignment.exerciseId;
          const isReassignActive =
            reassignSource?.exerciseId === assignment.exerciseId &&
            reassignSource?.memberId === assignment.memberId;
          const showConnector = idx < sortedAssignments.length - 1;

          return (
            <div key={getAssignmentKey(assignment)} className="exercise-wrapper">
              <div
                className={`exercise-card ${exercise.type} ${exercise.isRunning ? 'running' : ''} ${
                  isSwapActive ? 'swap-active' : ''
                } ${isReassignActive ? 'reassign-active' : ''}`}
              >
                {/* Zone Badge */}
                {!exercise.isRunning && (
                  <div className={`zone-badge ${exercise.type}`}>
                    Zone {Math.floor(exercise.zone)}
                  </div>
                )}

                {/* Content */}
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="exercise-name">
                      {exercise.isRunning && (
                        <span className="run-tag">{exercise.distance}</span>
                      )}
                      {exercise.name}
                    </h3>
                    <span className={`type-pill ${exercise.type}`}>
                      {exercise.type === 'strength' ? <Zap size={14} /> : <Activity size={14} />}
                    </span>
                  </div>

                  {/* Details Row */}
                  {!exercise.isRunning && (
                    <div className="exercise-details">
                      {exercise.reps && <span className="detail">{exercise.reps} reps</span>}
                      {exercise.distance && <span className="detail">{exercise.distance}</span>}
                      {exercise.equipment && <span className="detail equip">{exercise.equipment}</span>}
                    </div>
                  )}

                  {/* Assignment Section */}
                  {exercise.isShared ? (
                    <div className="shared-assignment">
                      <Users size={14} />
                      <span>Both team members</span>
                    </div>
                  ) : assignmentIsSplit ? (
                    <div className="split-assignment">
                      {splitSiblings.map((sibling, i) => {
                        const sibMember = plan.teamMembers.find((m) => m.id === sibling.memberId);
                        const fraction = sibling.splitFraction === 0.5 ? '50%' : 
                          sibling.splitFraction === 0.33 ? '33%' : 
                          sibling.splitFraction === 0.25 ? '25%' : 
                          `${Math.round((sibling.splitFraction ?? 1) * 100)}%`;
                        const isSibReassignActive =
                          reassignSource?.exerciseId === assignment.exerciseId &&
                          reassignSource?.memberId === sibling.memberId;

                        return (
                          <div
                            key={i}
                            className={`split-row ${getMemberColor(sibling.memberId)} ${
                              isSibReassignActive ? 'active' : ''
                            }`}
                          >
                            <span className="split-fraction">{fraction}</span>
                            <span className="split-name">{sibMember?.name}</span>
                            {exercise.weight && (
                              <span className="split-weight">
                                {getWeightForGender(exercise, getMemberGender(sibling.memberId))}
                              </span>
                            )}
                            <button
                              className="split-reassign-btn"
                              onClick={() => handleReassignClick(assignment.exerciseId, sibling.memberId)}
                              title="Reassign"
                            >
                              <UserPlus size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="single-assignment">
                      <div className={`assigned-member ${getMemberColor(assignment.memberId)}`}>
                        <span>{member?.name}</span>
                        {exercise.weight && (
                          <span className="member-weight">
                            {getWeightForGender(exercise, getMemberGender(assignment.memberId))}
                          </span>
                        )}
                      </div>
                      <select
                        value={assignment.memberId}
                        onChange={(e) => onAssignmentChange(assignment.exerciseId, e.target.value)}
                        className="member-select"
                        aria-label="Change assignment"
                      >
                        {plan.teamMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!exercise.isShared && !assignmentIsSplit && (
                    <div className="action-row">
                      {exercise.splittable && (
                        <button
                          className="action-btn split"
                          onClick={() => setSplitModal(assignment.exerciseId)}
                          title="Split exercise"
                        >
                          <Scissors size={14} />
                          <span>Split</span>
                        </button>
                      )}
                      <button
                        className={`action-btn swap ${isSwapActive ? 'active' : ''}`}
                        onClick={() => handleSwapClick(assignment.exerciseId)}
                        title="Swap with another"
                      >
                        <ArrowLeftRight size={14} />
                        <span>{isSwapActive ? 'Cancel' : 'Swap'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Connector */}
              {showConnector && (
                <div className="connector">
                  <div className="connector-line" />
                  <ChevronDown size={16} className="connector-icon" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Split Modal */}
      {splitModal && (
        <div className="modal-overlay" onClick={() => setSplitModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSplitModal(null)}>
              <X size={20} />
            </button>
            <h3>Split Exercise</h3>
            <p>Choose how to split this exercise:</p>
            <div className="split-options">
              <button onClick={() => { onSplit(splitModal, 2); setSplitModal(null); }}>
                50/50 (2 parts)
              </button>
              <button onClick={() => { onSplit(splitModal, 3); setSplitModal(null); }}>
                33/33/33 (3 parts)
              </button>
              <button onClick={() => { onSplit(splitModal, 4); setSplitModal(null); }}>
                25/25/25/25 (4 parts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Hint */}
      {reassignSource && (
        <div className="reassign-panel">
          <p>Select a team member:</p>
          <div className="reassign-options">
            {plan.teamMembers
              .filter((m) => m.id !== reassignSource.memberId)
              .map((m) => (
                <button
                  key={m.id}
                  className={getMemberColor(m.id)}
                  onClick={() => {
                    onReassign(reassignSource.exerciseId, reassignSource.memberId, m.id);
                    setReassignSource(null);
                  }}
                >
                  {m.name}
                </button>
              ))}
            <button className="cancel" onClick={() => setReassignSource(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
