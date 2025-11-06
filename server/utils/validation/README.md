# Input Sanitization Utility

A comprehensive input sanitization utility to prevent XSS attacks and ensure data security in the Job Finder application.

## Features

- **XSS Prevention**: Removes dangerous script tags, event handlers, and malicious URLs
- **SQL Injection Protection**: Sanitizes SQL injection patterns
- **HTML Entity Encoding**: Safely encodes dangerous characters
- **File Name Sanitization**: Prevents path traversal attacks
- **Email Validation**: Validates and sanitizes email addresses
- **URL Validation**: Ensures only safe HTTP/HTTPS URLs
- **Configurable**: Multiple sanitization modes for different use cases

## Quick Start

```typescript
import { sanitizeInput, sanitizeEmail, sanitizeUrl } from '~/server/utils/validation/sanitize';

// Basic input sanitization
const userInput = '<script>alert("xss")</script>Hello World!';
const safe = sanitizeInput(userInput);
// Result: "Hello World!" (script tags removed and HTML encoded)

// Email validation
const email = sanitizeEmail('user@example.com');
// Result: "user@example.com" (validated and normalized)

// URL validation
const url = sanitizeUrl('https://example.com');
// Result: "https://example.com" (validated as safe)
```

## API Reference

### Core Functions

#### `sanitizeInput(input: string, config?: SanitizeConfig): string`

The main sanitization function that removes dangerous patterns and encodes HTML entities.

**Parameters:**
- `input`: The string to sanitize
- `config`: Optional configuration object

**Configuration Options:**
```typescript
interface SanitizeConfig {
  allowHtml?: boolean;        // Allow HTML tags (default: false)
  allowedTags?: string[];     // Allowed HTML tags when allowHtml is true
  allowedAttributes?: string[]; // Allowed HTML attributes
  maxLength?: number;         // Maximum input length (default: 10000)
  strictMode?: boolean;       // Enable strict character validation (default: true)
}
```

**Example:**
```typescript
// Default sanitization
const result = sanitizeInput('<script>alert(1)</script>Hello');
// Result: "Hello"

// Custom configuration
const result = sanitizeInput('Hello <b>world</b>!', {
  allowHtml: true,
  allowedTags: ['b', 'i', 'em'],
  maxLength: 1000
});
```

### Specialized Functions

#### `sanitizeForDisplay(input: string): string`

Sanitizes input for display purposes with relaxed validation.

```typescript
const displayText = sanitizeForDisplay('Hello & welcome!');
// Result: "Hello &amp; welcome!"
```

#### `sanitizeForDatabase(input: string): string`

Sanitizes input for database storage with strict validation.

```typescript
const dbValue = sanitizeForDatabase('User input');
// Result: "User input" (strictly validated)
```

#### `sanitizeFileName(filename: string): string`

Sanitizes file names to prevent path traversal attacks.

```typescript
const safeFilename = sanitizeFileName('../../../etc/passwd');
// Result: "___etc_passwd"
```

#### `sanitizeEmail(email: string): string`

Validates and sanitizes email addresses.

```typescript
const email = sanitizeEmail('User@EXAMPLE.COM');
// Result: "user@example.com"

// Throws error for invalid emails
sanitizeEmail('invalid-email'); // Throws: "Invalid email format"
```

#### `sanitizeUrl(url: string): string`

Validates URLs and ensures only safe protocols.

```typescript
const url = sanitizeUrl('https://example.com');
// Result: "https://example.com"

// Throws error for dangerous URLs
sanitizeUrl('javascript:alert(1)'); // Throws: "Invalid URL protocol"
```

## Security Features

### XSS Protection

The utility detects and removes various XSS attack vectors:

- Script tags: `<script>alert(1)</script>`
- Event handlers: `<img onerror="alert(1)">`
- JavaScript URLs: `<a href="javascript:alert(1)">`
- Data URLs with scripts: `data:text/html,<script>alert(1)</script>`
- SVG with embedded scripts
- VBScript URLs

### SQL Injection Protection

Removes common SQL injection patterns:

- SQL comments: `-- comment` or `/* comment */`
- Union attacks: `UNION SELECT`
- Drop statements: `DROP TABLE`
- Other dangerous SQL keywords

### HTML Entity Encoding

Dangerous characters are encoded:

- `<` becomes `&lt;`
- `>` becomes `&gt;`
- `&` becomes `&amp;`
- `"` becomes `&quot;`
- `'` becomes `&#x27;`
- `/` becomes `&#x2F;`

## Usage Examples

### API Request Sanitization

```typescript
// In your API route
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const sanitizedData = {
    jobTitle: sanitizeForDatabase(body.jobTitle),
    description: sanitizeForDisplay(body.description),
    contactEmail: sanitizeEmail(body.contactEmail),
    websiteUrl: sanitizeUrl(body.websiteUrl)
  };

  // Use sanitizedData safely
});
```

### Form Input Processing

```typescript
// Processing user form data
function processUserProfile(formData: any) {
  return {
    name: sanitizeForDisplay(formData.name),
    bio: sanitizeForDisplay(formData.bio),
    email: sanitizeEmail(formData.email),
    website: sanitizeUrl(formData.website),
    avatar: sanitizeFileName(formData.avatarFile.name)
  };
}
```

### Content Management

```typescript
// For user-generated content
function processArticle(article: any) {
  return {
    title: sanitizeForDisplay(article.title),
    content: sanitizeInput(article.content, {
      allowHtml: true,
      allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li']
    }),
    author: sanitizeForDisplay(article.author)
  };
}
```

## Testing

The utility includes comprehensive tests covering:

- XSS attack vectors
- SQL injection patterns
- HTML entity encoding
- File name sanitization
- Email validation
- URL validation
- Edge cases and error handling

Run tests with:

```bash
pnpm test
```

## Best Practices

1. **Always sanitize user input** at the point of entry
2. **Use appropriate functions** for different contexts:
   - `sanitizeForDatabase()` for data storage
   - `sanitizeForDisplay()` for user-facing content
   - `sanitizeEmail()` for email addresses
   - `sanitizeUrl()` for URLs
3. **Validate on both client and server** (never trust client-side validation alone)
4. **Use strict mode** for sensitive operations
5. **Log sanitization events** for security monitoring
6. **Regularly update** the utility to handle new attack vectors

## Security Considerations

- This utility provides defense in depth but should be used alongside other security measures
- Content Security Policy (CSP) headers should also be implemented
- Regular security audits are recommended
- Keep dependencies updated
- Monitor for new attack vectors and update patterns accordingly

## Contributing

When adding new sanitization patterns:

1. Add the pattern to the appropriate function
2. Write comprehensive tests
3. Update this documentation
4. Ensure backward compatibility
5. Test with real-world attack vectors