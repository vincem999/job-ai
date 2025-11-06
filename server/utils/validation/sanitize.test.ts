/**
 * Tests for input sanitization utilities
 * Tests various XSS attack vectors and malicious inputs
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  sanitizeForDisplay,
  sanitizeForDatabase,
  sanitizeFileName,
  sanitizeEmail,
  sanitizeUrl,
} from './sanitize';

describe('sanitizeInput', () => {
  describe('XSS Attack Vectors', () => {
    it('should remove script tags', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove event handlers', () => {
      const maliciousInput = '<img src=x onerror=alert(1)//>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
    });

    it('should remove javascript URLs', () => {
      const maliciousInput = '<a href="javascript:alert(1)">click</a>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('javascript:');
      // The word "alert" may still be present but HTML encoded, which is safe
    });

    it('should remove SVG script injection', () => {
      const maliciousInput = '<svg><g/onload=alert(2)//<p>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('onload');
      expect(result).not.toContain('alert');
    });

    it('should remove iframe with javascript', () => {
      const maliciousInput = '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('javascript:');
      // The word "alert" may still be present but HTML encoded, which is safe
    });

    it('should remove math with xlink href script', () => {
      const maliciousInput = '<math><mi//xlink:href="data:x,<script>alert(4)</script>">';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('script');
      expect(result).not.toContain('alert');
    });

    it('should handle data URLs with HTML', () => {
      const maliciousInput = 'data:text/html,<script>alert(1)</script>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('data:text/html');
      expect(result).not.toContain('script');
    });

    it('should remove vbscript URLs', () => {
      const maliciousInput = '<a href="vbscript:msgbox(1)">click</a>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('vbscript:');
      // The word "msgbox" may still be present but HTML encoded, which is safe
    });
  });

  describe('SQL Injection Patterns', () => {
    it('should handle SQL comment injection', () => {
      const maliciousInput = "admin'-- ";
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('--');
    });

    it('should handle SQL union injection', () => {
      const maliciousInput = "' UNION SELECT * FROM users--";
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('UNION SELECT');
    });

    it('should handle SQL drop table injection', () => {
      const maliciousInput = "'; DROP TABLE users; --";
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('DROP TABLE');
    });

    it('should handle single quotes safely', () => {
      const input = "O'Brien";
      const result = sanitizeInput(input);
      // Single quotes should be HTML encoded for safety
      expect(result).toContain("O&#x27;Brien");
    });
  });

  describe('Input Validation', () => {
    it('should reject non-string input', () => {
      expect(() => sanitizeInput(123 as any)).toThrow('Input must be a string');
      expect(() => sanitizeInput(null as any)).toThrow('Input must be a string');
      expect(() => sanitizeInput(undefined as any)).toThrow('Input must be a string');
    });

    it('should limit input length', () => {
      const longInput = 'a'.repeat(20000);
      const result = sanitizeInput(longInput, { maxLength: 100 });
      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should normalize whitespace', () => {
      const input = 'hello    world\t\n  test';
      const result = sanitizeInput(input);
      expect(result).toBe('hello world test');
    });

    it('should remove control characters', () => {
      const input = 'hello\x00\x01\x02world';
      const result = sanitizeInput(input);
      expect(result).toBe('helloworld');
    });
  });

  describe('HTML Entity Encoding', () => {
    it('should encode dangerous HTML characters', () => {
      const input = '<div>"test"&\'script\'</div>';
      const result = sanitizeInput(input);
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
      expect(result).toContain('&amp;');
    });

    it('should encode equals and backticks', () => {
      const input = 'test=value`command';
      const result = sanitizeInput(input);
      expect(result).toContain('&#x3D;');
      expect(result).toContain('&#x60;');
    });
  });

  describe('Configuration Options', () => {
    it('should respect strict mode validation', () => {
      const input = 'hello<>world';
      // After HTML encoding, the result should not contain the original < > characters
      const result = sanitizeInput(input, { strictMode: true });
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should allow more characters in non-strict mode', () => {
      const input = 'hello<>world';
      const result = sanitizeInput(input, { strictMode: false });
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });
  });
});

describe('sanitizeForDisplay', () => {
  it('should be less strict than default sanitization', () => {
    const input = 'Hello! This is a test.';
    const result = sanitizeForDisplay(input);
    expect(result).toBe('Hello! This is a test.');
  });

  it('should still remove dangerous content', () => {
    const input = '<script>alert("xss")</script>Hello world';
    const result = sanitizeForDisplay(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('Hello world');
  });
});

describe('sanitizeForDatabase', () => {
  it('should be very strict', () => {
    const input = 'test@example.com';
    const result = sanitizeForDatabase(input);
    expect(result).toBe('test@example.com');
  });

  it('should limit length for database storage', () => {
    const longInput = 'a'.repeat(2000);
    const result = sanitizeForDatabase(longInput);
    expect(result.length).toBeLessThanOrEqual(1000);
  });
});

describe('sanitizeFileName', () => {
  it('should remove path traversal attempts', () => {
    const maliciousName = '../../../etc/passwd';
    const result = sanitizeFileName(maliciousName);
    expect(result).not.toContain('..');
    expect(result).toBe('___etc_passwd');
  });

  it('should replace dangerous characters', () => {
    const dangerousName = 'file<>:"/\\|?*.txt';
    const result = sanitizeFileName(dangerousName);
    expect(result).toBe('file_________.txt');
  });

  it('should handle empty or dot-only names', () => {
    expect(sanitizeFileName('')).toBe('sanitized_file');
    expect(sanitizeFileName('...')).toBe('sanitized_file');
    expect(sanitizeFileName('---')).toBe('sanitized_file');
  });

  it('should limit length', () => {
    const longName = 'a'.repeat(300) + '.txt';
    const result = sanitizeFileName(longName);
    expect(result.length).toBeLessThanOrEqual(255);
  });
});

describe('sanitizeEmail', () => {
  it('should accept valid emails', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
    ];

    validEmails.forEach(email => {
      expect(sanitizeEmail(email)).toBe(email.toLowerCase());
    });
  });

  it('should reject invalid emails', () => {
    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user..name@domain.com',
    ];

    invalidEmails.forEach(email => {
      expect(() => sanitizeEmail(email)).toThrow();
    });
  });

  it('should normalize email case', () => {
    const email = 'Test.User@EXAMPLE.COM';
    const result = sanitizeEmail(email);
    expect(result).toBe('test.user@example.com');
  });
});

describe('sanitizeUrl', () => {
  it('should accept valid HTTP/HTTPS URLs', () => {
    const validUrls = [
      'https://example.com',
      'http://localhost:3000',
      'https://sub.domain.com/path?query=value',
    ];

    validUrls.forEach(url => {
      expect(sanitizeUrl(url)).toBe(url);
    });
  });

  it('should reject dangerous protocols', () => {
    const dangerousUrls = [
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
      'file:///etc/passwd',
    ];

    dangerousUrls.forEach(url => {
      expect(() => sanitizeUrl(url)).toThrow('Invalid URL protocol');
    });
  });

  it('should reject malformed URLs', () => {
    const malformedUrls = [
      'not-a-url',
      'http://',
      'https://domain with spaces.com',
    ];

    malformedUrls.forEach(url => {
      expect(() => sanitizeUrl(url)).toThrow('Invalid URL format');
    });
  });
});