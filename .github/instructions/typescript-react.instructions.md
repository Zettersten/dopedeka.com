---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript & React Coding Standards

## TypeScript Conventions
- Use **strict mode** TypeScript (enabled in tsconfig.json)
- Define explicit types for function parameters and return values
- Use **interfaces** for object shapes and component props
- Use **type aliases** for unions, intersections, and complex types
- Avoid using `any` - use `unknown` or proper types instead
- Enable and respect all strict compiler options

## React Component Patterns
- Use **functional components** exclusively
- Use React 19 hooks (useState, useEffect, useCallback, useMemo, etc.)
- Properly type component props using TypeScript interfaces
- Use named exports for components (not default exports)
- Keep components focused on a single responsibility

## Component Props
Define props using interfaces:
```typescript
interface MyComponentProps {
  name: string;
  age: number;
  onUpdate?: (value: string) => void;
}

export function MyComponent({ name, age, onUpdate }: MyComponentProps) {
  // component implementation
}
```

## State Management
- Use `useState` for simple local state
- Use `useReducer` for complex state logic
- Use custom hooks to share stateful logic
- Type state explicitly when TypeScript can't infer it

## Event Handlers
- Type event handlers properly:
```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // handler implementation
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // handler implementation
};
```

## Custom Hooks
- Prefix custom hooks with `use` (e.g., `useLocalStorage`)
- Extract reusable logic into custom hooks
- Properly type hook return values
- Document complex hook behavior

## Imports
- Use the `@/` alias for imports from src directory
- Group imports: React first, then third-party, then local
- Use named imports when possible

Example:
```typescript
import { useState, useEffect } from 'react';
import { ExternalComponent } from 'external-library';
import { MyComponent } from '@/components/MyComponent';
import { MyType } from '@/types';
```

## Error Handling
- Handle errors gracefully with try-catch where appropriate
- Provide user-friendly error messages
- Log errors to console for debugging

## Performance
- Use `useMemo` to memoize expensive calculations
- Use `useCallback` to memoize callback functions passed as props
- Avoid unnecessary re-renders by keeping state minimal and local

## Accessibility
- Use semantic HTML elements
- Include proper ARIA labels where needed
- Ensure keyboard navigation works properly
- Test with screen readers when possible

## Code Organization
- One component per file
- Keep files under 300 lines when possible
- Extract complex logic into utilities or hooks
- Co-locate related files (component, styles, types)
