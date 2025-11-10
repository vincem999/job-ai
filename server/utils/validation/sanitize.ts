/**
 * Input sanitization utilities to prevent XSS attacks
 * Based on OWASP recommendations and security best practices
 */

/**
 * Configuration for sanitization rules
 */
interface SanitizeConfig {
  allowHtml?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
  maxLength?: number;
  strictMode?: boolean;
}

/**
 * Default configuration for strict sanitization
 */
const DEFAULT_CONFIG: SanitizeConfig = {
  allowHtml: false,
  allowedTags: [],
  allowedAttributes: [],
  maxLength: 10000,
  strictMode: true,
};

/**
 * HTML entity encoding map for common dangerous characters
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Dangerous script patterns that should be removed
 */
const DANGEROUS_PATTERNS = [
  // Script tags
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  // Event handlers
  /\bon\w+\s*=\s*["']?[^"'>]*["']?/gi,
  // JavaScript URLs
  /javascript\s*:/gi,
  // Data URLs with scripts
  /data\s*:\s*text\/html/gi,
  // Vbscript
  /vbscript\s*:/gi,
  // Meta refresh
  /<meta\s+http-equiv\s*=\s*["']?refresh["']?/gi,
  // Form action javascript
  /action\s*=\s*["']?javascript:/gi,
  // SVG script elements
  /<svg[^>]*>.*?<script.*?<\/script>.*?<\/svg>/gi,
  // Math ML script
  /<math[^>]*>.*?<script.*?<\/script>.*?<\/math>/gi,
];

/**
 * Encode HTML entities to prevent XSS
 */
const encodeHtmlEntities = (input: string): string => {
  return input.replace(/[&<>"'`=/]/g, (match) => HTML_ENTITIES[match] || match);
}

/**
 * Remove dangerous script patterns
 */
const removeDangerousPatterns = (input: string): string => {
  let cleaned = input;

  for (const pattern of DANGEROUS_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned;
}

/**
 * Validate input against allowlist patterns
 */
const validateInput = (input: string, config: SanitizeConfig): boolean => {
  if (config.strictMode) {
    // In strict mode, only allow alphanumeric, spaces, and basic safe punctuation
    // Note: We exclude dangerous characters like <> but this validation happens AFTER dangerous pattern removal
    const allowedPattern = /^[a-zA-Z0-9\s\-_.,!?@#$%^&*()+=[\]{}|\\:";'/`~]*$/;
    return allowedPattern.test(input);
  }

  return true;
}

/**
 * Remove or encode SQL injection patterns
 */
const sanitizeSqlPatterns = (input: string): string => {
  // Remove SQL comment patterns
  let cleaned = input.replace(/--.*$/gm, '');
  cleaned = cleaned.replace(/\/\*.*?\*\//gs, '');

  // Remove dangerous SQL keywords in suspicious contexts
  const dangerousSqlPatterns = [
    /\bunion\s+select\b/gi,
    /\bdrop\s+table\b/gi,
    /\bdelete\s+from\b/gi,
    /\binsert\s+into\b/gi,
    /\bupdate\s+set\b/gi,
    /\bexec\s*\(/gi,
    /\bexecute\s*\(/gi,
  ];

  for (const pattern of dangerousSqlPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned;
}

/**
 * Main sanitization function
 *
 * @param input - The input string to sanitize
 * @param config - Configuration options for sanitization
 * @returns Sanitized string safe for use in web applications
 */
export function sanitizeInput(input: string, config: SanitizeConfig = {}): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Limit input length
  let cleaned = input.slice(0, finalConfig.maxLength);

  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Remove null bytes and control characters
  // eslint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Remove dangerous script patterns FIRST
  cleaned = removeDangerousPatterns(cleaned);

  // Sanitize SQL injection patterns
  cleaned = sanitizeSqlPatterns(cleaned);

  // HTML encode if not allowing HTML
  if (!finalConfig.allowHtml) {
    cleaned = encodeHtmlEntities(cleaned);
  }

  // Validate input format AFTER processing (for strict mode)
  if (finalConfig.strictMode && !validateInput(cleaned, finalConfig)) {
    throw new Error('Input contains invalid characters');
  }

  return cleaned;
}

/**
 * Sanitize user input for display (less strict, allows basic formatting)
 */
export function sanitizeForDisplay(input: string): string {
  return sanitizeInput(input, {
    allowHtml: false,
    strictMode: false,
    maxLength: 5000,
  });
}

/**
 * Sanitize user input for database storage (very strict)
 */
export function sanitizeForDatabase(input: string): string {
  return sanitizeInput(input, {
    allowHtml: false,
    strictMode: true,
    maxLength: 1000,
  });
}

/**
 * Sanitize file names and paths
 */
export function sanitizeFileName(filename: string): string {
  // Remove path traversal attempts
  let cleaned = filename.replace(/\.\./g, '');

  // Remove or replace dangerous characters including path separators
  // eslint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');

  // Limit length
  cleaned = cleaned.slice(0, 255);

  // Ensure it doesn't start with dots or dashes
  cleaned = cleaned.replace(/^[.-]+/, '');

  // Ensure it's not empty
  if (!cleaned.trim()) {
    cleaned = 'sanitized_file';
  }

  return cleaned;
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  // Basic email validation and sanitization
  const cleaned = email.trim().toLowerCase();

  // Check for basic format requirements
  if (!cleaned.includes('@')) {
    throw new Error('Invalid email format');
  }

  const parts = cleaned.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error('Invalid email format');
  }

  const [localPart, domainPart] = parts;

  // Check for consecutive dots in local part
  if (localPart.includes('..')) {
    throw new Error('Invalid email format');
  }

  // Domain must contain at least one dot
  if (!domainPart.includes('.')) {
    throw new Error('Invalid email format');
  }

  // Domain cannot start or end with dot or hyphen
  if (domainPart.startsWith('.') || domainPart.endsWith('.') ||
      domainPart.startsWith('-') || domainPart.endsWith('-')) {
    throw new Error('Invalid email format');
  }

  // Final regex validation for allowed characters
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+$/;
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format');
  }

  return cleaned;
}

/**
 * Sanitize URLs
 */
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    // Return the exact URL as provided if it was valid
    return url;
  } catch {
    // Check if it's a protocol issue first
    if (url.includes(':') && !url.startsWith('http:') && !url.startsWith('https:')) {
      throw new Error('Invalid URL protocol');
    }
    throw new Error('Invalid URL format');
  }
}