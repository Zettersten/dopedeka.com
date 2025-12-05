import { useState } from 'react';
import { Plan } from '../types';
import { getExerciseById } from '../data/exercises';
import { getExerciseStats } from '../utils/planGenerator';
import './PlanDisplay.css';

interface PlanDisplayProps {
  plan: Plan;
  onAssignmentChange: (exerciseId: string, newMemberId: string) => void;
  onSplit: (exerciseId: string, splitCount: number) => void;
  onSwap: (exerciseId1: string, exerciseId2: string) => void;
  onReassign: (exerciseId: string, fromMemberId: string, toMemberId: string) => void;
}

export default function PlanDisplay({ 
  plan, 
  onAssignmentChange, 
  onSplit, 
  onSwap, 
  onReassign 
}: PlanDisplayProps) {
  const [splitModal, setSplitModal] = useState<{ exerciseId: string; assignmentId: string } | null>(null);
  const [swapSource, setSwapSource] = useState<string | null>(null);
  const [reassignSource, setReassignSource] = useState<{ exerciseId: string; memberId: string } | null>(null);

  const stats = getExerciseStats(plan);
  const sortedAssignments = [...plan.assignments].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return (a.splitIndex || 0) - (b.splitIndex || 0);
  });

  const handleSplitClick = (exerciseId: string, assignmentId: string) => {
    setSplitModal({ exerciseId, assignmentId });
  };

  const handleSplitConfirm = (splitCount: number) => {
    if (splitModal) {
      onSplit(splitModal.exerciseId, splitCount);
      setSplitModal(null);
    }
  };

  const handleSwapClick = (exerciseId: string) => {
    if (!swapSource) {
      setSwapSource(exerciseId);
    } else {
      if (swapSource !== exerciseId) {
        onSwap(swapSource, exerciseId);
      }
      setSwapSource(null);
    }
  };

  const handleReassignClick = (exerciseId: string, memberId: string) => {
    // If no source is set, set this as the source
    if (!reassignSource) {
      setReassignSource({ exerciseId, memberId });
    } else {
      // If clicking the same exercise/member, cancel
      if (reassignSource.exerciseId === exerciseId && reassignSource.memberId === memberId) {
        setReassignSource(null);
      }
      // Otherwise, this is a different exercise/member, so ignore (should use the member selection UI)
    }
  };

  const handleReassignToMember = (targetMemberId: string) => {
    if (reassignSource) {
      onReassign(reassignSource.exerciseId, reassignSource.memberId, targetMemberId);
      setReassignSource(null);
    }
  };

  const getAssignmentKey = (assignment: typeof sortedAssignments[0]) => {
    return `${assignment.exerciseId}-${assignment.memberId}-${assignment.splitIndex || 0}`;
  };

  const isSplit = (assignment: typeof sortedAssignments[0]) => {
    return assignment.parentExerciseId !== undefined;
  };

  const getSplitSiblings = (assignment: typeof sortedAssignments[0]) => {
    if (!isSplit(assignment)) return [];
    return sortedAssignments.filter(
      a => a.exerciseId === assignment.exerciseId && a.parentExerciseId
    );
  };

  return (
    <div className="plan-display">
      <div className="plan-header">
        <h2>Your DEKA Team Plan</h2>
        <p className="plan-subtitle">Customize your workout assignments</p>
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
          const isRunning = exercise.isRunning || false;
          const assignmentIsSplit = isSplit(assignment);
          const splitSiblings = getSplitSiblings(assignment);
          const showAsSplit = assignmentIsSplit && assignment.splitIndex === 0;
          const isSwapActive = swapSource === assignment.exerciseId;
          const isReassignActive = reassignSource?.exerciseId === assignment.exerciseId && 
                                   reassignSource?.memberId === assignment.memberId;

          // Skip rendering if this is a split part that's not the first one
          if (assignmentIsSplit && !showAsSplit) {
            return null;
          }

          const member = plan.teamMembers.find(m => m.id === assignment.memberId);
          const allSplitMembers = assignmentIsSplit 
            ? splitSiblings.map(s => plan.teamMembers.find(m => m.id === s.memberId)?.name).filter(Boolean)
            : [member?.name].filter(Boolean);

          return (
            <div 
              key={getAssignmentKey(assignment)} 
              className={`exercise-card ${exerciseTypeClass} ${isRunning ? 'running' : ''} ${isSwapActive ? 'swap-active' : ''} ${isReassignActive ? 'reassign-active' : ''}`}
              data-member={!assignmentIsSplit ? member?.name : allSplitMembers.join(', ')}
            >
              <div className="exercise-header">
                <div className="exercise-zone">Zone {exercise.zone}</div>
                <div className="exercise-type-badge">{exercise.type}</div>
              </div>
              <h3 className="exercise-name">
                {exercise.name}
                {assignmentIsSplit && (
                  <span className="split-badge">Split ({splitSiblings.length} parts)</span>
                )}
              </h3>
              <p className="exercise-description">{exercise.description}</p>
              
              {assignmentIsSplit && (
                <div className="split-info">
                  <div className="split-participants">
                    {splitSiblings.map((sibling, idx) => {
                      const siblingMember = plan.teamMembers.find(m => m.id === sibling.memberId);
                      const fraction = sibling.splitFraction || 0;
                      const isReassignActiveForSplit = reassignSource?.exerciseId === assignment.exerciseId && 
                                                       reassignSource?.memberId === sibling.memberId;
                      return (
                        <div 
                          key={idx} 
                          className={`split-participant ${isReassignActiveForSplit ? 'reassign-active' : ''}`}
                        >
                          <span className="split-fraction">{fraction === 0.25 ? '1/4' : fraction === 0.33 ? '1/3' : fraction === 0.5 ? '1/2' : `${fraction}`}</span>
                          <span className="split-member">{siblingMember?.name}</span>
                          {!exercise.isRunning && (
                            <button
                              className="split-reassign-button"
                              onClick={() => handleReassignClick(assignment.exerciseId, sibling.memberId)}
                              title="Reassign this part"
                            >
                              ↻
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!assignmentIsSplit && (
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
              )}

              {!isRunning && !assignmentIsSplit && exercise.splittable && (
                <div className="exercise-actions">
                  <button
                    className="action-button split-button"
                    onClick={() => handleSplitClick(assignment.exerciseId, getAssignmentKey(assignment))}
                    title="Split exercise"
                  >
                    Split
                  </button>
                  <button
                    className={`action-button swap-button ${isSwapActive ? 'active' : ''}`}
                    onClick={() => handleSwapClick(assignment.exerciseId)}
                    title="Swap with another exercise"
                  >
                    {isSwapActive ? 'Click another to swap' : 'Swap'}
                  </button>
                  <button
                    className={`action-button reassign-button ${isReassignActive ? 'active' : ''}`}
                    onClick={() => handleReassignClick(assignment.exerciseId, assignment.memberId)}
                    title="Reassign to another member"
                  >
                    {isReassignActive ? 'Click member to reassign' : 'Reassign'}
                  </button>
                </div>
              )}

              {!isRunning && !assignmentIsSplit && !exercise.splittable && (
                <div className="exercise-actions">
                  <button
                    className={`action-button swap-button ${isSwapActive ? 'active' : ''}`}
                    onClick={() => handleSwapClick(assignment.exerciseId)}
                    title="Swap with another exercise"
                  >
                    {isSwapActive ? 'Click another to swap' : 'Swap'}
                  </button>
                  <button
                    className={`action-button reassign-button ${isReassignActive ? 'active' : ''}`}
                    onClick={() => handleReassignClick(assignment.exerciseId, assignment.memberId)}
                    title="Reassign to another member"
                  >
                    {isReassignActive ? 'Click member to reassign' : 'Reassign'}
                  </button>
                </div>
              )}

              {isRunning && (
                <div className="running-assignment">
                  <div className="running-label">All team members must complete together</div>
                  <div className="running-members">
                    {plan.teamMembers.map((member) => (
                      <span key={member.id} className="running-member-badge">{member.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {splitModal && (
        <div className="modal-overlay" onClick={() => setSplitModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Split Exercise</h3>
            <p>How many parts would you like to split this into?</p>
            <div className="split-options">
              <button className="split-option-button" onClick={() => handleSplitConfirm(2)}>
                1/2 (2 parts)
              </button>
              <button className="split-option-button" onClick={() => handleSplitConfirm(3)}>
                1/3 (3 parts)
              </button>
              <button className="split-option-button" onClick={() => handleSplitConfirm(4)}>
                1/4 (4 parts)
              </button>
              <button className="split-option-button cancel" onClick={() => setSplitModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {reassignSource && (
        <div className="reassign-hint">
          <p>Select a team member to reassign this exercise to:</p>
          <div className="reassign-members">
            {plan.teamMembers
              .filter(m => m.id !== reassignSource.memberId)
              .map((member) => (
                <button
                  key={member.id}
                  className="reassign-member-button"
                  onClick={() => handleReassignToMember(member.id)}
                >
                  {member.name}
                </button>
              ))}
            <button
              className="reassign-member-button cancel"
              onClick={() => setReassignSource(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
