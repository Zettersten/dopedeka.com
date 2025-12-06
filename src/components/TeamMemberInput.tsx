import { X } from 'lucide-react';
import { TeamMember, Gender } from '../types';
import './TeamMemberInput.css';

interface TeamMemberInputProps {
  member: TeamMember;
  onNameChange: (id: string, name: string) => void;
  onGenderChange: (id: string, gender: Gender) => void;
  onWeightChange: (id: string, weight: number) => void;
  onFitnessChange: (id: string, fitness: number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

/** Team member input card with name, gender, and preference slider */
export default function TeamMemberInput({
  member,
  onNameChange,
  onGenderChange,
  onWeightChange,
  onFitnessChange,
  onRemove,
  canRemove,
}: TeamMemberInputProps) {
  return (
    <div className="team-member-card">
      {/* Remove Button */}
      {canRemove && (
        <button
          className="remove-btn"
          onClick={() => onRemove(member.id)}
          aria-label="Remove team member"
        >
          <X size={18} />
        </button>
      )}

      {/* Name Input */}
      <input
        type="text"
        className="name-input"
        value={member.name}
        onChange={(e) => onNameChange(member.id, e.target.value)}
        placeholder="Enter name"
        aria-label="Team member name"
      />

      {/* Gender Toggle */}
      <div className="gender-toggle">
        <button
          className={`gender-btn ${member.gender === 'female' ? 'active' : ''}`}
          onClick={() => onGenderChange(member.id, 'female')}
          aria-label="Female"
          aria-pressed={member.gender === 'female'}
        >
          ♀ Female
        </button>
        <button
          className={`gender-btn ${member.gender === 'male' ? 'active' : ''}`}
          onClick={() => onGenderChange(member.id, 'male')}
          aria-label="Male"
          aria-pressed={member.gender === 'male'}
        >
          ♂ Male
        </button>
      </div>

      {/* Preference Slider */}
      <div className="preference-section">
        <div className="preference-labels">
          <span className="pref-label cardio">Cardio Focus</span>
          <span className="pref-label strength">Strength Focus</span>
        </div>
        
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={member.strengthWeight}
            onChange={(e) => onWeightChange(member.id, Number(e.target.value))}
            className="preference-slider"
            aria-label="Strength preference percentage"
          />
          <div className="slider-track">
            <div
              className="slider-fill"
              style={{ width: `${member.strengthWeight}%` }}
            />
            <div
              className="slider-thumb"
              style={{ left: `${member.strengthWeight}%` }}
            />
          </div>
        </div>

        <div className="preference-value">
          <span className="pref-percent cardio">{100 - member.strengthWeight}%</span>
          <span className="pref-divider">/</span>
          <span className="pref-percent strength">{member.strengthWeight}%</span>
        </div>
      </div>

      {/* Fitness Level Slider */}
      <div className="preference-section">
        <div className="preference-labels">
          <span className="pref-label-single">Overall Fitness Level</span>
        </div>
        
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={member.fitnessLevel}
            onChange={(e) => onFitnessChange(member.id, Number(e.target.value))}
            className="preference-slider"
            aria-label="Overall fitness level"
          />
          <div className="slider-track fitness">
            <div
              className="slider-fill fitness"
              style={{ width: `${member.fitnessLevel}%` }}
            />
            <div
              className="slider-thumb"
              style={{ left: `${member.fitnessLevel}%` }}
            />
          </div>
        </div>

        <div className="preference-value">
          <span className="fitness-label">Lower</span>
          <span className="pref-percent fitness">{member.fitnessLevel}%</span>
          <span className="fitness-label">Higher</span>
        </div>
      </div>
    </div>
  );
}
