import { Plan } from '../types';
import { getPlanTimeline, getExerciseStats } from '../utils/planGenerator';
import { getWeightForGender } from '../data/exercises';
import { Users, Zap, Activity, ArrowDown } from 'lucide-react';
import './TimelineView.css';

interface TimelineViewProps {
  plan: Plan;
}

/** Timeline/Canvas view showing plan as a workflow */
export default function TimelineView({ plan }: TimelineViewProps) {
  const timeline = getPlanTimeline(plan);
  const stats = getExerciseStats(plan);

  const getMemberColor = (memberId: string) => {
    const idx = plan.teamMembers.findIndex((m) => m.id === memberId);
    return `member-${idx + 1}`;
  };

  const getMemberName = (memberId: string) =>
    plan.teamMembers.find((m) => m.id === memberId)?.name ?? 'Unknown';

  const getMemberGender = (memberId: string) =>
    plan.teamMembers.find((m) => m.id === memberId)?.gender ?? 'female';

  return (
    <div className="timeline-view">
      {/* Stats Header */}
      <div className="timeline-stats">
        {stats.map((stat, idx) => (
          <div key={stat.memberId} className={`timeline-stat-card member-${idx + 1}`}>
            <div className="stat-avatar">{stat.memberName.charAt(0).toUpperCase()}</div>
            <div className="stat-info">
              <span className="stat-name">{stat.memberName}</span>
              <div className="stat-breakdown">
                <span className="stat-pill strength">
                  <Zap size={12} /> {stat.strengthExercises}
                </span>
                <span className="stat-pill cardio">
                  <Activity size={12} /> {stat.cardioExercises}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Flow */}
      <div className="timeline-flow">
        {timeline.map((item, idx) => {
          const { exercise, assignments } = item;
          const isShared = exercise.isShared || exercise.isRunning;
          const isSplit = assignments.length > 1 && assignments[0].parentExerciseId;
          const isLast = idx === timeline.length - 1;

          return (
            <div key={`${exercise.id}-${idx}`} className="timeline-node-wrapper">
              {/* Node */}
              <div
                className={`timeline-node ${exercise.type} ${isShared ? 'shared' : ''} ${
                  exercise.isRunning ? 'running' : ''
                }`}
              >
                {/* Zone Badge */}
                {!exercise.isRunning && (
                  <div className="node-zone">Zone {Math.floor(exercise.zone)}</div>
                )}

                {/* Main Content */}
                <div className="node-content">
                  <h3 className="node-title">
                    {exercise.isRunning && <span className="run-distance">{exercise.distance}</span>}
                    {exercise.name}
                  </h3>

                  {/* Exercise Details */}
                  {!exercise.isRunning && (
                    <div className="node-details">
                      {exercise.reps && <span className="detail-badge reps">{exercise.reps}</span>}
                      {exercise.distance && (
                        <span className="detail-badge distance">{exercise.distance}</span>
                      )}
                      {exercise.equipment && (
                        <span className="detail-badge equipment">{exercise.equipment}</span>
                      )}
                    </div>
                  )}

                  {/* Assigned Members */}
                  <div className="node-members">
                    {isShared ? (
                      <div className="shared-badge">
                        <Users size={14} />
                        <span>BOTH</span>
                      </div>
                    ) : isSplit ? (
                      <div className="split-members">
                        {assignments.map((a, i) => {
                          const fraction =
                            a.splitFraction === 0.5
                              ? '50%'
                              : a.splitFraction === 0.33
                              ? '33%'
                              : a.splitFraction === 0.25
                              ? '25%'
                              : `${Math.round((a.splitFraction ?? 1) * 100)}%`;
                          return (
                            <div key={i} className={`member-chip ${getMemberColor(a.memberId)}`}>
                              <span className="chip-fraction">{fraction}</span>
                              <span className="chip-name">{getMemberName(a.memberId)}</span>
                              {exercise.weight && (
                                <span className="chip-weight">
                                  {getWeightForGender(exercise, getMemberGender(a.memberId))}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`member-chip ${getMemberColor(assignments[0].memberId)}`}>
                        <span className="chip-name">{getMemberName(assignments[0].memberId)}</span>
                        {exercise.weight && (
                          <span className="chip-weight">
                            {getWeightForGender(exercise, getMemberGender(assignments[0].memberId))}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Type Indicator */}
                <div className={`node-type-indicator ${exercise.type}`}>
                  {exercise.type === 'strength' ? <Zap size={16} /> : <Activity size={16} />}
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="timeline-connector">
                  <div className="connector-line" />
                  <ArrowDown size={16} className="connector-arrow" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
