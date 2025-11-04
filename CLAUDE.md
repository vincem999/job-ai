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

## Gestion des tâches avec TaskMaster

This project uses TaskMaster AI for project management:

- Configuration in `.taskmaster/` directory
- Tasks defined in `.taskmaster/tasks/tasks.json`
- PRD available in `.taskmaster/docs/prd.txt` describing a CV Optimizer application

### Workflow de configuration des tâches

#### 1. Expansion des tâches

Avant de commencer, toujours développer les tâches en sous-tâches :

```bash
task-master expand --all
```

#### 2. Revue du plan

- Lister les tâches : `task-master list`
- Voir les détails d'une tâche : `task-master show --id=<##>`
- Vérifier la structure des dossiers, dépendances, et pertinence

### Workflow d'exécution

#### 1. Sélectionner la prochaine tâche

Toujours utiliser la commande `next` pour respecter les dépendances :

```bash
task-master next
```

#### 2. Discussion avant exécution

- Confirmer la compréhension de la tâche avant de coder
- Référencer les fichiers et dossiers pertinents avec @mentions
- Valider le plan d'action proposé

#### 3. Exécution

- Ne commencer qu'après validation du plan
- Suivre la stratégie de test définie dans la tâche

#### 4. Validation et clôture

```bash
task-master set-status --id=<##> --status=done
```

### Commandes de modification

- **Mettre à jour une tâche** : `task-master update-task --id=<##> --prompt="description des changements"`
- **Créer des règles** : Documenter les patterns et solutions pour référence future

### Principes à respecter

1. **Ne jamais sauter l'étape de discussion** - Toujours confirmer la compréhension avant de coder
2. **Respecter les dépendances** - Utiliser `next` plutôt que choisir arbitrairement
3. **Tester selon la stratégie** - Chaque tâche a une stratégie de test à suivre
4. **Documenter les règles** - Les erreurs résolues deviennent des règles pour l'avenir
5. **Tâches atomiques** - Préférer des sous-tâches claires aux tâches monolithiques

### Commandes rapides

| Action              | Commande                                         |
| ------------------- | ------------------------------------------------ |
| Prochaine tâche     | `task-master next`                               |
| Lister tout         | `task-master list`                               |
| Détails tâche       | `task-master show --id=<##>`                     |
| Marquer terminé     | `task-master set-status --id=<##> --status=done` |
| Analyser complexité | `task-master analyze-complexity`                 |
| Développer tout     | `task-master expand --all`                       |

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
