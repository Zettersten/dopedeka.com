# DEKA Team Assignment Tool

A modern, offline-friendly web application for creating and managing DEKA team exercise challenge plans. This tool helps teams distribute exercises based on each member's strength vs cardio preferences.

## Features

- **Team Management**: Add up to 4 team members with customizable names
- **Preference Weighting**: Adjustable slider for strength vs cardio preferences per team member
- **Smart Plan Generation**: Automatically generates exercise assignments based on preferences
- **Plan Customization**: Edit and adjust exercise assignments after generation
- **Offline Support**: Works offline with localStorage persistence
- **Modern UI**: Beautiful, responsive design with smooth animations

## Technology Stack

- **React 19** - Latest React framework
- **TypeScript** - Type-safe development
- **Vite 6** - Next-generation build tool
- **CSS3** - Modern styling with CSS variables

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This application is configured for GitHub Pages deployment via GitHub Actions. The CI/CD pipeline automatically builds and deploys the application when changes are pushed to the `main` branch.

### Setup GitHub Pages

1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Push changes to the `main` branch to trigger deployment

## DEKA Challenge

Learn more about the DEKA challenge at [spartan.com/deka/mile](https://www.spartan.com/en/deka/mile)

## License

MIT
