# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint (via @nuxt/eslint)

### Package Management
- Use `pnpm` as the package manager (specified in package.json)

## Architecture

### Framework
- **Nuxt 4** with Vue 3 and TypeScript
- Uses the new `app/` directory structure for Nuxt 4
- **Nuxt UI 4** for components and styling
- **ESLint** configured via @nuxt/eslint module

### Project Structure
```
job-finder/
├── app/                    # Nuxt 4 app directory
│   └── app.vue            # Root component with NuxtWelcome
├── nuxt.config.ts         # Nuxt configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

### Configuration
- **nuxt.config.ts**: Basic Nuxt 4 setup with @nuxt/eslint and @nuxt/ui modules
- **tsconfig.json**: References Nuxt's generated TypeScript configs
- **eslint.config.mjs**: Uses Nuxt's ESLint configuration

### TaskMaster Integration
This project uses TaskMaster AI for project management:
- Configuration in `.taskmaster/` directory
- Tasks defined in `.taskmaster/tasks/tasks.json`
- PRD available in `.taskmaster/docs/prd.txt` describing a CV Optimizer application
- VSCode rule profile configured (not Cursor)

### Current State
The project is a fresh Nuxt 4 setup with the default welcome page. According to the PRD, this will become a CV optimization tool that:
- Analyzes job offers using OpenAI API
- Adapts CVs to match job requirements
- Generates cover letters
- Exports documents as PDFs

## Development Notes

### TypeScript
- Strict TypeScript configuration enabled
- All Nuxt TypeScript configs are referenced, not embedded
- Use proper typing for all new components and utilities

### Nuxt 4 Patterns
- Use the `app/` directory for all application code
- Components should leverage Nuxt UI 4 for consistency
- Server routes go in `server/` directory when needed
- Use Nuxt composables for reactive state management

### Code Style
- Follow the existing ESLint configuration
- Use Vue 3 Composition API patterns
- Prefer TypeScript interfaces over types where appropriate