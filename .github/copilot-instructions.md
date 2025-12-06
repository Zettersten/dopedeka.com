# DEKA Team Assignment Tool - Copilot Instructions

## Repository Purpose
This is a modern, offline-friendly web application for creating and managing DEKA team exercise challenge plans. The tool helps teams distribute exercises based on each member's strength vs cardio preferences.

## Project Structure
- `/src` - Source code directory
  - `/components` - React components
  - `/data` - Static data (exercises)
  - `/hooks` - Custom React hooks
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
- `/public` - Static assets
- `/dist` - Production build output (generated)
- `.github/workflows` - CI/CD workflows

## Technology Stack
- **React 19** - Latest React framework with modern hooks
- **TypeScript 5.6** - Type-safe development
- **Vite 6** - Next-generation build tool and dev server
- **CSS3** - Modern styling with CSS variables
- **ESLint 9** - Code linting with TypeScript support

## Development Standards

### TypeScript & React
- Use **TypeScript** for all new files (`.ts` and `.tsx` extensions)
- Use **functional components** with React hooks
- Prefer **named exports** over default exports for components
- Use proper TypeScript types - avoid `any` when possible
- Follow **React 19** best practices and hooks patterns
- Use the `@/` path alias for imports from src directory (configured in tsconfig.json)

### Code Style
- Use **ESLint** for code formatting and linting
- Follow the existing ESLint configuration in `eslint.config.js`
- Unused function parameters should be prefixed with underscore (`_`)
- Maximum 0 warnings allowed in ESLint
- Use `const` by default, `let` only when reassignment is needed
- Use arrow functions for callbacks and utilities

### State Management
- Use React's built-in state management (useState, useReducer)
- Use the custom `useLocalStorage` hook for persistent state
- Keep state as local as possible, lift only when necessary

### Styling
- Use plain CSS files with modern CSS features
- Use CSS variables for theming (defined in index.css)
- Follow existing component styling patterns
- Ensure responsive design for mobile and desktop

### Component Guidelines
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper PropTypes or TypeScript interfaces for props
- Maintain accessibility standards (semantic HTML, ARIA labels)

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 5173 by default)
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing
- Currently no test framework is configured
- Manual testing is required for changes
- Test on multiple screen sizes (mobile, tablet, desktop)

## Deployment
- Automatically deployed to GitHub Pages via GitHub Actions
- Workflow file: `.github/workflows/deploy.yml`
- Deploys from `main` branch on push
- The 404.html is copied from index.html for client-side routing

## Key Features to Maintain
- **Offline functionality** - App works without internet connection
- **localStorage persistence** - User data survives page refreshes
- **Responsive design** - Works on all screen sizes
- **Print support** - Special print view for plans
- **Smooth animations** - Professional UI/UX

## Important Notes
- The app is designed to work offline, avoid adding online-only features
- Keep the bundle size small for fast loading
- Maintain backward compatibility with existing localStorage data
- Focus on usability and accessibility

## Dependencies
- Avoid adding new dependencies unless absolutely necessary
- Use built-in browser APIs when possible
- Keep dependencies up to date for security

## Git & Version Control
- Follow conventional commit messages
- Keep commits focused and atomic
- Update documentation when changing features
- Test thoroughly before committing
