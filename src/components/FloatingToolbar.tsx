import { 
  RotateCcw, 
  Printer, 
  Sun, 
  Moon, 
  Trash2, 
  LayoutGrid, 
  GitBranch,
  Home
} from 'lucide-react';
import { ViewMode } from '../types';
import './FloatingToolbar.css';

interface FloatingToolbarProps {
  onPrint: () => void;
  onReset: () => void;
  onClearAll: () => void;
  onToggleDarkMode: () => void;
  onViewChange: (mode: ViewMode) => void;
  onGoHome: () => void;
  darkMode: boolean;
  currentView: ViewMode;
  showHomeButton?: boolean;
}

/** Floating action toolbar for primary actions */
export default function FloatingToolbar({
  onPrint,
  onReset,
  onClearAll,
  onToggleDarkMode,
  onViewChange,
  onGoHome,
  darkMode,
  currentView,
  showHomeButton = false,
}: FloatingToolbarProps) {
  return (
    <div className="floating-toolbar">
      <div className="toolbar-group">
        {showHomeButton && (
          <button
            className="toolbar-btn"
            onClick={onGoHome}
            title="Back to setup"
            aria-label="Back to setup"
          >
            <Home size={20} />
          </button>
        )}
        
        <button
          className={`toolbar-btn ${currentView === 'cards' ? 'active' : ''}`}
          onClick={() => onViewChange('cards')}
          title="Card view"
          aria-label="Card view"
        >
          <LayoutGrid size={20} />
        </button>
        
        <button
          className={`toolbar-btn ${currentView === 'timeline' ? 'active' : ''}`}
          onClick={() => onViewChange('timeline')}
          title="Timeline view"
          aria-label="Timeline view"
        >
          <GitBranch size={20} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={onPrint}
          title="Print plan"
          aria-label="Print plan"
        >
          <Printer size={20} />
        </button>
        
        <button
          className="toolbar-btn"
          onClick={onReset}
          title="Reset plan"
          aria-label="Reset plan"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          className="toolbar-btn danger"
          onClick={onClearAll}
          title="Clear all data"
          aria-label="Clear all data"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <button
        className="toolbar-btn theme-toggle"
        onClick={onToggleDarkMode}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}
