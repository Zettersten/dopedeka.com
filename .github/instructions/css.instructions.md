---
applyTo: "**/*.css"
---

# CSS Coding Standards

## General Principles
- Use modern CSS features (CSS Grid, Flexbox, CSS Variables)
- Follow mobile-first responsive design
- Keep selectors simple and maintainable
- Avoid deep nesting and overly specific selectors

## CSS Variables
- Use CSS variables defined in `index.css` for theming
- Create new variables for reusable values (colors, spacing, etc.)
- Follow the existing naming convention for variables

Example:
```css
:root {
  --primary-color: #2563eb;
  --spacing-unit: 8px;
}
```

## Responsive Design
- Design for mobile first, then enhance for larger screens
- Use media queries for breakpoints
- Test on multiple screen sizes
- Common breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

Example:
```css
.container {
  padding: 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 2rem;
  }
}
```

## Layout
- Prefer Flexbox and CSS Grid over floats
- Use logical properties when appropriate (e.g., `margin-inline-start`)
- Maintain consistent spacing using spacing variables

## Typography
- Use relative units (rem, em) for font sizes
- Maintain readable line heights (1.5-1.7 for body text)
- Ensure sufficient color contrast for accessibility

## Animations & Transitions
- Use CSS transitions for simple animations
- Keep animations smooth and performant
- Use `transform` and `opacity` for best performance
- Respect user preferences: `@media (prefers-reduced-motion: reduce)`

Example:
```css
.element {
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;
  }
}
```

## Component Styles
- Use component-specific class names to avoid conflicts
- Follow BEM naming convention when appropriate
- Keep component styles close to the component file
- Avoid global styles except in index.css

## Browser Compatibility
- Test in modern browsers (Chrome, Firefox, Safari, Edge)
- Use autoprefixer through Vite for vendor prefixes
- Avoid experimental features without fallbacks

## Print Styles
- Include print-specific styles when needed
- Hide unnecessary UI elements in print view
- Ensure readable text and proper page breaks

## Performance
- Minimize use of expensive properties (box-shadow, filter)
- Avoid layout thrashing in animations
- Use `will-change` sparingly and only when needed
- Optimize for repaints and reflows

## Accessibility
- Ensure sufficient color contrast (WCAG AA minimum)
- Avoid relying solely on color to convey information
- Make sure focus indicators are visible
- Support keyboard navigation styling
