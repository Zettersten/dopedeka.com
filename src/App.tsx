import { useCallback, useEffect, useState } from 'react';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { TeamMember, Plan, ViewMode, Gender } from './types';
import { createTeamMember, generatePlan, updatePlanAssignments, splitExercise, swapExercises, reassignExercise } from './utils/planGenerator';
import { useLocalStorage } from './hooks/useLocalStorage';
import TeamMemberInput from './components/TeamMemberInput';
import PlanDisplay from './components/PlanDisplay';
import TimelineView from './components/TimelineView';
import PrintView from './components/PrintView';
import FloatingToolbar from './components/FloatingToolbar';
import './App.css';

function App() {
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('deka-team-members', [
    createTeamMember('', 'female', 50),
    createTeamMember('', 'female', 50),
  ]);

  const [plan, setPlan] = useLocalStorage<Plan | null>('deka-plan', null);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('deka-dark-mode', true);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleAddMember = useCallback(() => {
    if (teamMembers.length >= 4) return;
    setTeamMembers([...teamMembers, createTeamMember('', 'female', 50)]);
  }, [teamMembers, setTeamMembers]);

  const handleRemoveMember = useCallback(
    (id: string) => {
      if (teamMembers.length <= 1) return;
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
    },
    [teamMembers, setTeamMembers]
  );

  const handleNameChange = useCallback(
    (id: string, name: string) => {
      setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, name } : m)));
    },
    [teamMembers, setTeamMembers]
  );

  const handleGenderChange = useCallback(
    (id: string, gender: Gender) => {
      setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, gender } : m)));
    },
    [teamMembers, setTeamMembers]
  );

  const handleWeightChange = useCallback(
    (id: string, weight: number) => {
      setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, strengthWeight: weight } : m)));
    },
    [teamMembers, setTeamMembers]
  );

  const handleGeneratePlan = useCallback(() => {
    const validMembers = teamMembers.filter((m) => m.name.trim().length > 0);
    if (validMembers.length === 0) {
      alert('Please add at least one team member with a name');
      return;
    }
    setPlan(generatePlan(validMembers));
  }, [teamMembers, setPlan]);

  const handleAssignmentChange = useCallback(
    (exerciseId: string, newMemberId: string) => {
      if (plan) setPlan(updatePlanAssignments(plan, exerciseId, newMemberId));
    },
    [plan, setPlan]
  );

  const handleSplit = useCallback(
    (exerciseId: string, splitCount: number) => {
      if (plan) setPlan(splitExercise(plan, exerciseId, splitCount));
    },
    [plan, setPlan]
  );

  const handleSwap = useCallback(
    (exerciseId1: string, exerciseId2: string) => {
      if (plan) setPlan(swapExercises(plan, exerciseId1, exerciseId2));
    },
    [plan, setPlan]
  );

  const handleReassign = useCallback(
    (exerciseId: string, fromMemberId: string, toMemberId: string) => {
      if (plan) setPlan(reassignExercise(plan, exerciseId, fromMemberId, toMemberId));
    },
    [plan, setPlan]
  );

  const handleReset = useCallback(() => {
    if (confirm('Reset plan? This will return you to team setup.')) {
      setPlan(null);
    }
  }, [setPlan]);

  const handleClearAll = useCallback(() => {
    if (confirm('Clear all data? This cannot be undone.')) {
      window.localStorage.removeItem('deka-team-members');
      window.localStorage.removeItem('deka-plan');
      window.localStorage.removeItem('deka-dark-mode');
      setTeamMembers([createTeamMember('', 'female', 50), createTeamMember('', 'female', 50)]);
      setPlan(null);
      setDarkMode(true);
    }
  }, [setTeamMembers, setPlan, setDarkMode]);

  const handlePrint = useCallback(() => window.print(), []);

  const handleGoHome = useCallback(() => setPlan(null), [setPlan]);

  const validMemberCount = teamMembers.filter((m) => m.name.trim()).length;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <div className="logo-text">
            <h1>DEKA MILE</h1>
            <span className="logo-subtitle">Team Planner</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {!plan ? (
          /* Setup Phase */
          <div className="setup-phase">
            <div className="setup-header">
              <h2>Build Your Team</h2>
              <p>Add team members and set their preferences for the optimal workout split.</p>
            </div>

            <div className="members-grid">
              {teamMembers.map((member) => (
                <TeamMemberInput
                  key={member.id}
                  member={member}
                  onNameChange={handleNameChange}
                  onGenderChange={handleGenderChange}
                  onWeightChange={handleWeightChange}
                  onRemove={handleRemoveMember}
                  canRemove={teamMembers.length > 1}
                />
              ))}

              {teamMembers.length < 4 && (
                <button className="add-member-btn" onClick={handleAddMember}>
                  <Plus size={24} />
                  <span>Add Member</span>
                </button>
              )}
            </div>

            <div className="setup-actions">
              <button
                className="generate-btn"
                onClick={handleGeneratePlan}
                disabled={validMemberCount === 0}
              >
                <Sparkles size={20} />
                <span>Generate Plan</span>
              </button>

              <button className="clear-btn" onClick={handleClearAll}>
                <Trash2 size={18} />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        ) : (
          /* Plan Phase */
          <div className="plan-phase">
            {viewMode === 'cards' ? (
              <PlanDisplay
                plan={plan}
                onAssignmentChange={handleAssignmentChange}
                onSplit={handleSplit}
                onSwap={handleSwap}
                onReassign={handleReassign}
              />
            ) : (
              <TimelineView plan={plan} />
            )}

            <FloatingToolbar
              onPrint={handlePrint}
              onReset={handleReset}
              onClearAll={handleClearAll}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              onViewChange={setViewMode}
              onGoHome={handleGoHome}
              darkMode={darkMode}
              currentView={viewMode}
              showHomeButton
            />
          </div>
        )}
      </main>

      {/* Print View - Only visible when printing */}
      {plan && <PrintView plan={plan} />}
    </div>
  );
}

export default App;
