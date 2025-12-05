import { Plan } from '../types';
import { getPlanTimeline } from '../utils/planGenerator';
import { getWeightForGender, getExerciseDisplayName } from '../data/exercises';
import './PrintView.css';

interface PrintViewProps {
  plan: Plan;
}

/** Clean printable table view of the plan */
export default function PrintView({ plan }: PrintViewProps) {
  const timeline = getPlanTimeline(plan);

  const getMemberName = (memberId: string) =>
    plan.teamMembers.find((m) => m.id === memberId)?.name ?? '';

  const getMemberGender = (memberId: string) =>
    plan.teamMembers.find((m) => m.id === memberId)?.gender ?? 'female';

  const formatAssignment = (item: ReturnType<typeof getPlanTimeline>[0]) => {
    const { exercise, assignments } = item;

    if (exercise.isShared || exercise.isRunning) {
      return 'BOTH';
    }

    if (assignments.length > 1 && assignments[0].parentExerciseId) {
      // Split exercise
      return assignments.map((a) => getMemberName(a.memberId)).join(' / ');
    }

    return getMemberName(assignments[0].memberId);
  };

  const formatWeight = (item: ReturnType<typeof getPlanTimeline>[0]) => {
    const { exercise, assignments } = item;
    if (!exercise.weight) return '';

    if (assignments.length === 1 || exercise.isShared) {
      const gender = getMemberGender(assignments[0].memberId);
      return getWeightForGender(exercise, gender);
    }

    // For splits, show both weights if different genders
    const weights = [...new Set(
      assignments.map((a) => getWeightForGender(exercise, getMemberGender(a.memberId)))
    )];
    return weights.join(' / ');
  };

  return (
    <div className="print-view">
      <div className="print-header">
        <h1>DEKA MILE</h1>
        <div className="print-team">
          Team: {plan.teamMembers.map((m) => m.name).join(' & ')}
        </div>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th className="col-zone">Zone</th>
            <th className="col-exercise">Exercise</th>
            <th className="col-details">Details</th>
            <th className="col-weight">Weight</th>
            <th className="col-assigned">Assigned</th>
          </tr>
        </thead>
        <tbody>
          {timeline.map((item, idx) => {
            const { exercise, assignments } = item;
            const displayName = getExerciseDisplayName(exercise);
            const isSplit = assignments.length > 1 && assignments[0].parentExerciseId;

            return (
              <tr
                key={`${exercise.id}-${idx}`}
                className={`${exercise.type} ${exercise.isRunning ? 'running' : ''}`}
              >
                <td className="col-zone">
                  {exercise.isRunning ? '—' : Math.floor(exercise.zone)}
                </td>
                <td className="col-exercise">
                  {displayName}
                  {isSplit && <span className="split-indicator"> (Split)</span>}
                </td>
                <td className="col-details">
                  {exercise.equipment || exercise.description}
                </td>
                <td className="col-weight">{formatWeight(item)}</td>
                <td className="col-assigned">{formatAssignment(item)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="print-footer">
        <p>DEKA MILE 2025 • Generated {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
