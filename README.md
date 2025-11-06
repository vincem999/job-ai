# Job Finder - CV Optimizer

A Nuxt 4 application that analyzes job offers and generates optimized CVs and cover letters using AI.

## Features

- **Job Analysis**: Analyze job offers to extract key requirements and skills
- **CV Adaptation**: Automatically adapt your master CV to match job requirements
- **Cover Letter Generation**: Generate personalized cover letters
- **PDF Export**: Export documents as professional PDFs

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3 and TypeScript
- **UI**: Nuxt UI 4 with Tailwind CSS v4
- **State Management**: Pinia
- **AI**: OpenAI API for intelligent document generation
- **Deployment**: Vercel

## Setup

### 1. Install Dependencies

Make sure to install dependencies:

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:

```bash
# Required: OpenAI API key for job analysis and document generation
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Required: Perplexity API key for research features (TaskMaster AI)
PERPLEXITY_API_KEY=pplx-your-perplexity-api-key-here
```

#### Getting API Keys

- **OpenAI API Key** (Required)
  - Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  - Create a new API key
  - The key should start with `sk-proj-`
  - Used for job analysis, CV adaptation, and cover letter generation

- **Perplexity API Key** (Required for TaskMaster research features)
  - Visit [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
  - Create a new API key
  - The key should start with `pplx-`
  - Used for research-backed task generation and updates

#### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for AI features | `sk-proj-...` |
| `PERPLEXITY_API_KEY` | ✅ Yes | Perplexity API key for research | `pplx-...` |
| `UPSTASH_REDIS_URL` | ❌ No | Redis URL for rate limiting (Phase 2+) | `redis://...` |
| `UPSTASH_REDIS_TOKEN` | ❌ No | Redis token for rate limiting (Phase 2+) | `...` |
| `SENTRY_DSN` | ❌ No | Sentry DSN for error monitoring (Phase 2+) | `https://...` |

#### Security & Configuration

- **Runtime Configuration**: All environment variables are configured in `nuxt.config.ts` using Nuxt's `runtimeConfig`
- **Server-Side Only**: Private keys (API keys) are only accessible server-side and never exposed to the client bundle
- **Type Safety**: All configuration values are properly typed in TypeScript
- **Validation**: The application validates that required environment variables are present at startup

#### Troubleshooting

**Error: "OPENAI_API_KEY is not configured"**
- Ensure your `.env` file exists and contains the `OPENAI_API_KEY`
- Verify the API key starts with `sk-proj-`
- Restart the development server after adding environment variables

**Error: "Perplexity API key missing"**
- Ensure your `.env` file contains the `PERPLEXITY_API_KEY`
- Verify the API key starts with `pplx-`
- This key is required for TaskMaster research features

**Development vs Production**
- In development: Environment variables are loaded from `.env` file
- In production (Vercel): Set environment variables in the Vercel dashboard
- The application uses the same `runtimeConfig` structure in both environments

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
