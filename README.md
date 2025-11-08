# CV Optimizer - Job Finder

An intelligent CV optimization tool built with Nuxt 4 that analyzes job offers and generates perfectly tailored CVs and cover letters using AI.

## 🎯 Problem Solved

Job searching is time-consuming and repetitive. This application automates the process of:
- Adapting your CV for each job application (30-45 minutes → 10 seconds)
- Writing personalized cover letters that match job requirements
- Ensuring consistent formatting and professional presentation
- Optimizing content to match job keywords and requirements

## ✨ Features

### Core Functionality
- **Job Offer Analysis**: Extract key skills, requirements, and company tone from job postings
- **Intelligent CV Adaptation**: Automatically reorganize and rewrite your CV to match specific job requirements
- **Personalized Cover Letter Generation**: Create compelling cover letters that reference specific job details
- **Professional PDF Export**: Generate print-ready documents with consistent formatting
- **Real-time Preview**: See your optimized documents before downloading

### Technical Features
- **AI-Powered**: Uses OpenAI's GPT-4o-mini for intelligent content generation
- **Type-Safe**: Full TypeScript implementation with runtime validation
- **Error Monitoring**: Integrated Sentry for production error tracking
- **Performance Optimized**: Lighthouse scores >85, fast loading times
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API and TypeScript
- **UI Components**: Nuxt UI 4 with Tailwind CSS v4
- **State Management**: Pinia for reactive state management
- **AI Integration**: OpenAI API with custom prompt engineering
- **Validation**: Zod for runtime type safety
- **Testing**: Vitest for unit testing
- **Error Monitoring**: Sentry for production monitoring
- **Deployment**: Vercel with automatic deployments
- **Performance**: Lighthouse CI for performance monitoring

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm 8+ (recommended package manager)
- OpenAI API account with credits

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-finder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Add your API keys to `.env`**
   ```bash
   # Required: OpenAI API key for AI features
   OPENAI_API_KEY=sk-proj-your-openai-api-key-here

   # Required: Sentry DSN for error monitoring
   SENTRY_DSN=your-sentry-dsn-here
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - View the landing page and click "Try the App" to access the dashboard

## ⚙️ Configuration

### Required Environment Variables

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for AI features | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `SENTRY_DSN` | ✅ Yes | Sentry DSN for error monitoring | [Sentry Dashboard](https://sentry.io/settings/) |

### Optional Environment Variables

| Variable | Required | Description | Purpose |
|----------|----------|-------------|---------|
| `PERPLEXITY_API_KEY` | ❌ No | Perplexity API for research | TaskMaster AI research features |
| `SENTRY_AUTH_TOKEN` | ❌ No | Sentry auth token | Source map uploads in production |
| `UPSTASH_REDIS_URL` | ❌ No | Redis URL | Future rate limiting enhancements |
| `UPSTASH_REDIS_TOKEN` | ❌ No | Redis token | Future rate limiting enhancements |

### Getting API Keys

#### OpenAI API Key (Required)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account
3. Create a new secret key
4. Copy the key (starts with `sk-proj-`)
5. Add to your `.env` file as `OPENAI_API_KEY`

**Cost**: Approximately $0.002 per CV generation (very affordable)

#### Sentry Setup (Required for Production)
1. Visit [Sentry](https://sentry.io) and create an account
2. Create a new project for "Nuxt"
3. Copy the DSN from your project settings
4. Add to your `.env` file as `SENTRY_DSN`

### Configuration Validation

The application validates all required environment variables at startup:
- Missing required variables will show clear error messages
- Invalid API key formats are detected early
- Runtime configuration is type-safe and validated

## 🚀 Development

### Development Server

Start the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint for code quality |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:ui` | Run tests with Vitest UI |
| `pnpm test:run` | Run tests in CI mode |

### Performance Testing

| Command | Description |
|---------|-------------|
| `pnpm lighthouse` | Run Lighthouse analysis |
| `pnpm perf` | Run simple performance test |
| `pnpm perf:full` | Run comprehensive performance test |

## 🏗️ Project Structure

```
job-finder/
├── app/                          # Nuxt 4 app directory
│   ├── components/               # Vue components
│   │   ├── dashboard/            # Dashboard UI components
│   │   ├── landing/              # Landing page components
│   │   └── templates/            # Document templates
│   ├── pages/                    # Route pages
│   └── assets/                   # Static assets
├── server/                       # Server-side code
│   ├── api/                      # API endpoints
│   ├── middleware/               # Server middleware
│   └── utils/                    # Server utilities
├── types/                        # TypeScript type definitions
├── templates/                    # CV data templates
├── composables/                  # Vue composables
├── stores/                       # Pinia stores
└── .taskmaster/                  # TaskMaster AI configuration
```

## 🎮 How to Use

1. **Visit the Landing Page** - Learn about the project and its features
2. **Navigate to Dashboard** - Click "Try the App" to access the main interface
3. **Paste Job Offer** - Copy and paste a job offer you want to apply to
4. **Generate Documents** - Click "Generate CV & Letter" and wait for AI processing
5. **Preview Results** - Review the optimized CV and cover letter
6. **Download PDFs** - Download professional PDF versions of both documents

## 🧪 Testing

### Unit Tests

Run the test suite:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm test:ui
```

### Type Checking

Ensure TypeScript types are correct:

```bash
pnpm typecheck
```

### Linting

Check code quality:

```bash
pnpm lint
```

## 🏭 Production

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Deployment

The application is configured for deployment on Vercel:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment Variables**: Add required API keys in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main branch

#### Environment Variables for Production

Set these in your Vercel dashboard:

```bash
OPENAI_API_KEY=sk-proj-your-actual-key
SENTRY_DSN=your-actual-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
```

## 🔧 Troubleshooting

### Common Issues

**"OPENAI_API_KEY is not configured"**
- Ensure `.env` file exists and contains valid OpenAI API key
- Restart development server after adding environment variables
- Check that the key starts with `sk-proj-`

**"Failed to analyze job offer"**
- Check your OpenAI account has available credits
- Verify the API key has proper permissions
- Ensure the job offer text is between 100-10,000 characters

**Build errors during `pnpm build`**
- Run `pnpm typecheck` to identify TypeScript issues
- Run `pnpm lint` to fix code quality issues
- Clear `.nuxt` cache and retry

**Performance issues**
- Check browser console for errors
- Monitor network requests in DevTools
- Use `pnpm perf` to run performance tests

### Development Tips

1. **Hot Reloading**: The development server supports hot module replacement
2. **Type Safety**: Use TypeScript strict mode for better error detection
3. **Component Testing**: Test components in isolation using Vitest
4. **API Testing**: Use the test endpoints in `/server/api/test-*` for debugging

## 📊 Performance

This application is optimized for performance:

- **Lighthouse Score**: >85 on all metrics
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Bundle Size**: Optimized with tree-shaking and code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📜 License

This project is private and proprietary. All rights reserved.

---

**Built with ❤️ using Nuxt 4, Vue 3, and OpenAI**
