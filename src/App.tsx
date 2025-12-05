import { useCallback } from 'react';
import { TeamMember, Plan } from './types';
import { createTeamMember, generatePlan, updatePlanAssignments } from './utils/planGenerator';
import { useLocalStorage } from './hooks/useLocalStorage';
import TeamMemberInput from './components/TeamMemberInput';
import PlanDisplay from './components/PlanDisplay';
import './App.css';

function App() {
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('deka-team-members', [
    createTeamMember('Team Member 1', 50),
    createTeamMember('Team Member 2', 50),
  ]);

  const [plan, setPlan] = useLocalStorage<Plan | null>('deka-plan', null);

  const handleAddMember = useCallback(() => {
    if (teamMembers.length >= 4) return;
    setTeamMembers([...teamMembers, createTeamMember('', 50)]);
  }, [teamMembers, setTeamMembers]);

  const handleRemoveMember = useCallback((id: string) => {
    if (teamMembers.length <= 1) return;
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  }, [teamMembers, setTeamMembers]);

  const handleNameChange = useCallback((id: string, name: string) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, name } : m));
  }, [teamMembers, setTeamMembers]);

  const handleWeightChange = useCallback((id: string, weight: number) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, strengthWeight: weight } : m));
  }, [teamMembers, setTeamMembers]);

  const handleGeneratePlan = useCallback(() => {
    const validMembers = teamMembers.filter(m => m.name.trim().length > 0);
    if (validMembers.length === 0) {
      alert('Please add at least one team member with a name');
      return;
    }
    const newPlan = generatePlan(validMembers);
    setPlan(newPlan);
  }, [teamMembers, setPlan]);

  const handleAssignmentChange = useCallback((exerciseId: string, newMemberId: string) => {
    if (!plan) return;
    const updatedPlan = updatePlanAssignments(plan, exerciseId, newMemberId);
    setPlan(updatedPlan);
  }, [plan, setPlan]);

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset? This will clear your current plan.')) {
      setPlan(null);
    }
  }, [setPlan]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>DEKA Team Assignment Tool</h1>
        <p className="app-subtitle">Create and customize your team's workout plan</p>
      </header>

      <main className="app-main">
        {!plan ? (
          <div className="setup-phase">
            <div className="setup-header">
              <h2>Set Up Your Team</h2>
              <p>Add team members and adjust their strength/cardio preferences</p>
            </div>

            <div className="team-members-section">
              {teamMembers.map((member) => (
                <TeamMemberInput
                  key={member.id}
                  member={member}
                  onNameChange={handleNameChange}
                  onWeightChange={handleWeightChange}
                  onRemove={handleRemoveMember}
                  canRemove={teamMembers.length > 1}
                />
              ))}
            </div>

            <div className="actions">
              {teamMembers.length < 4 && (
                <button
                  className="button button-secondary"
                  onClick={handleAddMember}
                >
                  + Add Team Member
                </button>
              )}
              <button
                className="button button-primary"
                onClick={handleGeneratePlan}
                disabled={teamMembers.filter(m => m.name.trim().length > 0).length === 0}
              >
                Generate Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="plan-phase">
            <div className="plan-actions">
              <button
                className="button button-secondary"
                onClick={handleReset}
              >
                Create New Plan
              </button>
            </div>
            <PlanDisplay
              plan={plan}
              onAssignmentChange={handleAssignmentChange}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          DEKA Team Assignment Tool •{' '}
          <a
            href="https://www.spartan.com/en/deka/mile"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about DEKA
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
