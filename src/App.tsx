import { useCallback, useEffect } from 'react';
import { TeamMember, Plan } from './types';
import { createTeamMember, generatePlan, updatePlanAssignments, splitExercise, swapExercises, reassignExercise } from './utils/planGenerator';
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
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('deka-dark-mode', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

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

  const handleSplit = useCallback((exerciseId: string, splitCount: number) => {
    if (!plan) return;
    const updatedPlan = splitExercise(plan, exerciseId, splitCount);
    setPlan(updatedPlan);
  }, [plan, setPlan]);

  const handleSwap = useCallback((exerciseId1: string, exerciseId2: string) => {
    if (!plan) return;
    const updatedPlan = swapExercises(plan, exerciseId1, exerciseId2);
    setPlan(updatedPlan);
  }, [plan, setPlan]);

  const handleReassign = useCallback((exerciseId: string, fromMemberId: string, toMemberId: string) => {
    if (!plan) return;
    const updatedPlan = reassignExercise(plan, exerciseId, fromMemberId, toMemberId);
    setPlan(updatedPlan);
  }, [plan, setPlan]);

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset? This will clear your current plan.')) {
      setPlan(null);
    }
  }, [setPlan]);

  return (
    <div className="app">
      <main className="app-main">
        {!plan ? (
          <div className="setup-phase">
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
                  + Add Member
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
                Reset
              </button>
              <button
                className="dark-mode-toggle"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            <PlanDisplay
              plan={plan}
              onAssignmentChange={handleAssignmentChange}
              onSplit={handleSplit}
              onSwap={handleSwap}
              onReassign={handleReassign}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
