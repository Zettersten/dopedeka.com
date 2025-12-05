import { X, Zap, Activity } from 'lucide-react';
import { TeamMember, Gender } from '../types';
import './TeamMemberInput.css';

interface TeamMemberInputProps {
  member: TeamMember;
  onNameChange: (id: string, name: string) => void;
  onGenderChange: (id: string, gender: Gender) => void;
  onWeightChange: (id: string, weight: number) => void;
  onCardioCapacityChange: (id: string, capacity: number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

/** Team member input card with name, gender, preference, and cardio capacity sliders */
export default function TeamMemberInput({
  member,
  onNameChange,
  onGenderChange,
  onWeightChange,
  onCardioCapacityChange,
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
          <X size={16} />
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
        <div className="preference-header">
          <Activity size={14} className="pref-icon cardio" />
          <span className="pref-title">Exercise Preference</span>
          <Zap size={14} className="pref-icon strength" />
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
          <span className="pref-percent cardio">{100 - member.strengthWeight}% cardio</span>
          <span className="pref-percent strength">{member.strengthWeight}% strength</span>
        </div>
      </div>

      {/* Cardio Capacity / Overall Bias Slider */}
      <div className="capacity-section">
        <div className="capacity-header">
          <span className="capacity-title">Overall Capacity</span>
          <span className="capacity-value">{member.cardioCapacity}%</span>
        </div>
        
        <div className="slider-container capacity">
          <input
            type="range"
            min="0"
            max="100"
            value={member.cardioCapacity}
            onChange={(e) => onCardioCapacityChange(member.id, Number(e.target.value))}
            className="capacity-slider"
            aria-label="Cardio capacity percentage"
          />
          <div className="slider-track capacity">
            <div
              className="slider-fill capacity"
              style={{ width: `${member.cardioCapacity}%` }}
            />
            <div
              className="slider-thumb capacity"
              style={{ left: `${member.cardioCapacity}%` }}
            />
          </div>
        </div>
        
        <p className="capacity-hint">Higher = takes on more overall workload</p>
      </div>
    </div>
  );
}
