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

## Error Handling Policy

**CRITICAL**: You must ALWAYS resolve errors completely - NEVER skip or ignore them.

When encountering an error:

1. ✅ **Stop and analyze** - Understand the root cause before proceeding
2. ✅ **Fix thoroughly** - Implement a complete solution, not a workaround
3. ✅ **Test the fix** - Verify the error is completely resolved
4. ✅ **Document if needed** - Add the solution to project rules for future reference

❌ **NEVER**:

- Skip an error to move forward
- Suggest "we'll fix this later"
- Leave warnings or errors unresolved
- Propose temporary workarounds without fixing the underlying issue
- Move to the next task while errors remain

If an error is blocking and requires user input or decision, clearly explain:

- What the error is
- Why it's blocking
- What options are available to resolve it
- Your recommended solution

**Remember**: Every unresolved error compounds technical debt and can cause cascading issues later.

## Git Workflow

**MANDATORY**: After completing each task, you MUST commit and push changes automatically.

### Commit Process (REQUIRED after each task)

**MANDATORY Pre-Commit Checks**: Before staging, you MUST ensure:

1. ✅ **Type-Check Passed**: No TypeScript errors (using the strict configuration).
2. ✅ **Lint Passed**: No ESLint errors or warnings remain (`pnpm lint`).
3. 🛑 **If checks fail**: Go back to step 2/3 of the Error Handling Policy (Fix thoroughly & Test the fix). **DO NOT COMMIT** if lint or type-check fails.

**Commit Steps**:

1. **Stage all changes**: `git add .`
2. **Commit with meaningful message**: `git commit -m "feat: [task description]"`
3. **Push to remote**: `git push`

### Commit Message Format

Follow conventional commits format:

- `feat: [description]` - New feature or functionality
- `fix: [description]` - Bug fix
- `refactor: [description]` - Code refactoring without changing functionality
- `docs: [description]` - Documentation changes
- `style: [description]` - Code style/formatting changes
- `test: [description]` - Adding or updating tests
- `chore: [description]` - Maintenance tasks, dependency updates

**Examples**:

- `feat: add job offer analysis component`
- `fix: resolve PDF generation encoding issue`
- `refactor: improve CV matching algorithm`
- `docs: update API documentation`

### When to Commit

You MUST commit and push:

- ✅ After completing a task successfully
- ✅ After resolving all errors for that task
- ✅ After all tests pass
- ✅ Before marking a task as "done" in TaskMaster

❌ DO NOT commit:

- Code with unresolved errors
- Incomplete implementations
- Code that doesn't run or build

### Commit Message Content

Include in your commit message:

- Brief description of what was done (max 72 characters for first line)
- Task ID if applicable (e.g., `feat(task-42): add user authentication`)
- Any breaking changes or important notes

**Note**: If git push fails (e.g., authentication issues, conflicts), inform the user immediately and wait for their input.

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
- **Resolve ALL errors before marking task as complete**

#### 4. Validation et clôture

**MANDATORY steps in order:**

1. Verify all errors are resolved
2. Verify tests pass
3. **Git commit and push changes** (see Git Workflow section)
4. Use TaskMaster MCP tools to update task status to "done"

**Only mark as done when all errors are resolved, tests pass, AND changes are committed and pushed.**

### Principes à respecter

1. **Ne jamais sauter l'étape de discussion** - Always confirm understanding before coding
2. **Respecter les dépendances** - Use MCP tools to get next task rather than choosing arbitrarily
3. **Tester selon la stratégie** - Each task has a testing strategy to follow
4. **Résoudre toutes les erreurs** - Never skip or ignore errors, always fix them completely
5. **Commit et push systématiquement** - ALWAYS commit and push after completing a task
6. **Documenter les règles** - Resolved errors become rules for the future
7. **Tâches atomiques** - Prefer clear subtasks over monolithic tasks

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
