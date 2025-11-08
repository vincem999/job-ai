# Sentry Error Monitoring Setup

This document explains how to configure Sentry error monitoring for the CV Optimizer application.

## Overview

Sentry is integrated into the application to monitor errors in both client-side and server-side code. The integration captures:

- JavaScript errors in the browser
- Server-side errors in API routes
- Performance metrics and traces
- User session replays (for debugging)

## Configuration

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Sentry DSN (Data Source Name) - get this from your Sentry project settings
SENTRY_DSN=https://your-dsn@your-org.ingest.sentry.io/your-project-id

# Optional: Sentry auth token for source map uploads and releases
SENTRY_AUTH_TOKEN=your-auth-token

# Optional: Sentry organization and project for releases
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
```

### 2. File Structure

The Sentry integration consists of:

- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `nuxt.config.ts` - Module registration
- `app/pages/test-error.vue` - Error testing page (development only)
- `server/api/test-error.post.ts` - Server error testing endpoint (development only)

## Setting Up Alerts and Notifications

### 1. Access Sentry Dashboard

1. Go to [sentry.io](https://sentry.io) and log in
2. Navigate to your project dashboard
3. Go to **Settings** > **Alerts**

### 2. Configure Alert Rules

#### Critical Error Alert
```
Name: Critical Application Errors
Conditions:
  - Event: Error
  - Environment: production
  - Event frequency: > 1 error in 1 minute
Actions:
  - Send email to: team@yourcompany.com
  - Send Slack notification to: #alerts
```

#### High Error Rate Alert
```
Name: High Error Rate
Conditions:
  - Event: Error
  - Event frequency: > 10 errors in 5 minutes
  - Environment: production
Actions:
  - Send email to: team@yourcompany.com
  - Send Slack notification to: #critical-alerts
```

#### New Issue Alert
```
Name: New Error Types
Conditions:
  - Event: Error
  - The issue is first seen
  - Environment: production
Actions:
  - Send email to: developers@yourcompany.com
```

### 3. Configure Integrations

#### Slack Integration
1. Go to **Settings** > **Integrations**
2. Find and install the Slack integration
3. Authorize Sentry to access your Slack workspace
4. Configure channels for different alert types

#### Email Notifications
1. Go to **Settings** > **Notifications**
2. Configure email rules for different team members
3. Set up escalation policies for unresolved issues

#### GitHub/GitLab Integration
1. Install the GitHub/GitLab integration
2. Enable automatic issue creation for critical errors
3. Configure commit/PR linking for better context

## Testing Error Monitoring

### Development Testing

Visit `/test-error` in your development environment to test:

1. **Client Error**: Triggers a JavaScript error captured by Sentry
2. **Async Error**: Tests asynchronous error handling
3. **Server Error**: Triggers a server-side API error

### Production Validation

1. Deploy with proper `SENTRY_DSN` configured
2. Trigger a controlled test error
3. Verify the error appears in Sentry dashboard
4. Confirm alerts are sent to configured channels

## Performance Monitoring

Sentry also captures performance data:

- **Transaction Traces**: API response times, database queries
- **Page Load Metrics**: Core Web Vitals for user experience
- **Custom Metrics**: Business logic performance

Configure performance alerts for:
- Slow API responses (> 2 seconds)
- High database query times
- Poor Core Web Vitals scores

## Best Practices

### 1. Error Context
```typescript
import * as Sentry from '@sentry/nuxt'

// Add user context
Sentry.setUser({
  id: user.id,
  email: user.email
})

// Add tags for filtering
Sentry.setTag('feature', 'cv-generation')

// Add custom context
Sentry.setContext('cv_data', {
  sections: cvData.sections.length,
  hasPhoto: !!cvData.photo
})
```

### 2. Custom Error Handling
```typescript
try {
  await generateCV(data)
} catch (error) {
  // Add relevant context before capturing
  Sentry.withScope((scope) => {
    scope.setTag('operation', 'cv-generation')
    scope.setContext('input_data', {
      sections: data.sections?.length,
      template: data.template
    })
    Sentry.captureException(error)
  })
  throw error
}
```

### 3. Filtering Sensitive Data

Sentry is configured to filter sensitive information:
- API keys are never logged
- Personal data is scrubbed from error context
- File contents are not captured

## Troubleshooting

### Common Issues

1. **No errors appearing**: Check `SENTRY_DSN` is correctly set
2. **Too many alerts**: Adjust alert thresholds and use error grouping
3. **Missing context**: Ensure proper error wrapping with context

### Debug Mode

Enable Sentry debug mode in development:

```typescript
// sentry.client.config.ts
Sentry.init({
  debug: process.env.NODE_ENV === 'development',
  // ... other config
})
```

## Security Considerations

- Never commit `SENTRY_DSN` or auth tokens to version control
- Use environment variables for all sensitive configuration
- Regularly rotate auth tokens
- Review captured data to ensure no sensitive information is logged

## Maintenance

### Regular Tasks

1. **Weekly**: Review error trends and performance metrics
2. **Monthly**: Update alert thresholds based on application growth
3. **Quarterly**: Review and clean up old alerts and integrations
4. **Release**: Tag releases in Sentry for better error tracking

### Monitoring Health

- Set up alerts for when Sentry itself stops receiving data
- Monitor error rate trends to catch degrading performance
- Review user impact metrics for prioritizing fixes