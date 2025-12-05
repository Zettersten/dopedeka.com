import { TeamMember } from '../types';
import './TeamMemberInput.css';

interface TeamMemberInputProps {
  member: TeamMember;
  onNameChange: (id: string, name: string) => void;
  onWeightChange: (id: string, weight: number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export default function TeamMemberInput({
  member,
  onNameChange,
  onWeightChange,
  onRemove,
  canRemove,
}: TeamMemberInputProps) {
  return (
    <div className="team-member-input">
      <div className="team-member-header">
        <input
          type="text"
          className="member-name-input"
          value={member.name}
          onChange={(e) => onNameChange(member.id, e.target.value)}
          placeholder="Team member name"
          aria-label="Team member name"
        />
        {canRemove && (
          <button
            className="remove-button"
            onClick={() => onRemove(member.id)}
            aria-label="Remove team member"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="weight-slider-container">
        <div className="weight-labels">
          <span className="weight-label">Cardio</span>
          <span className="weight-label">Strength</span>
        </div>
        <div className="slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            value={member.strengthWeight}
            onChange={(e) => onWeightChange(member.id, Number(e.target.value))}
            className="weight-slider"
            aria-label={`${member.name} strength preference`}
          />
          <div className="slider-track">
            <div
              className="slider-fill"
              style={{ width: `${member.strengthWeight}%` }}
            />
          </div>
        </div>
        <div className="weight-value">
          {member.strengthWeight}% Strength / {100 - member.strengthWeight}% Cardio
        </div>
      </div>
    </div>
  );
}
