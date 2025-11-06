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
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Perplexity API key for research features (TaskMaster AI)
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

**Getting API Keys**:
- **OpenAI**: Get your API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Perplexity**: Get your API key from [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)

**Security Note**: The API keys are configured in `nuxt.config.ts` using `runtimeConfig`, which ensures they are only accessible server-side and never exposed to the client bundle.

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
