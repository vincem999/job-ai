# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context7 Integration

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

For this project, prioritize these libraries:

- `/nuxt/nuxt` - For Nuxt 4 framework documentation
- `/nuxt/ui` - For Nuxt UI 4 components and styling
- `/microsoft/TypeScript` - For TypeScript guidance
- `/vitejs/vite` - For Vite build tool (used by Nuxt)

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

## Gestion des tâches avec TaskMaster MCP

This project uses TaskMaster AI for project management via MCP (Model Context Protocol):

- Configuration in `.taskmaster/` directory
- Tasks defined in `.taskmaster/tasks/tasks.json`
- PRD available in `.taskmaster/docs/prd.txt` describing a CV Optimizer application

**IMPORTANT**: TaskMaster is configured as an MCP server. Use the MCP tools directly - DO NOT use CLI commands like `task-master next`. Instead, use the available MCP tools to interact with tasks.

### Workflow de configuration des tâches

#### 1. Expansion des tâches

Use TaskMaster MCP tools to expand tasks into subtasks when needed.

#### 2. Revue du plan

Use TaskMaster MCP tools to:

- List tasks
- View task details by ID
- Check folder structure, dependencies, and relevance

### Workflow d'exécution

#### 1. Sélectionner la prochaine tâche

Use TaskMaster MCP tools to get the next task respecting dependencies.

#### 2. Discussion avant exécution

- Confirm understanding of the task before coding
- Reference relevant files and folders with @mentions
- Validate the proposed action plan

#### 3. Exécution

- Only start after plan validation
- Follow the testing strategy defined in the task

#### 4. Validation et clôture

Use TaskMaster MCP tools to update task status to "done".

### Principes à respecter

1. **Ne jamais sauter l'étape de discussion** - Always confirm understanding before coding
2. **Respecter les dépendances** - Use MCP tools to get next task rather than choosing arbitrarily
3. **Tester selon la stratégie** - Each task has a testing strategy to follow
4. **Documenter les règles** - Resolved errors become rules for the future
5. **Tâches atomiques** - Prefer clear subtasks over monolithic tasks

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
