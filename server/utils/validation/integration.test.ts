/**
 * Integration tests for sanitization utility
 * Tests real-world usage scenarios
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

describe('Sanitization Integration Tests', () => {
  describe('Real-world XSS scenarios', () => {
    it('should handle complex XSS attack attempts', () => {
      const maliciousInputs = [
        // Complex script injection
        '<script>document.cookie="stolen="+document.cookie</script>',
        // SVG with embedded script
        '<svg onload="alert(document.domain)">',
        // Image with onerror
        '<img src="invalid" onerror="window.location=\'http://evil.com\'">',
        // Form with javascript action
        '<form action="javascript:alert(1)"><input type="submit"></form>',
        // Mixed case to bypass filters
        '<ScRiPt>AlErT(1)</ScRiPt>',
        // Encoded characters
        '&lt;script&gt;alert(1)&lt;/script&gt;',
      ];

      maliciousInputs.forEach(input => {
        const result = sanitizeInput(input);
        expect(result).not.toContain('<script');
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('onload');
      });
    });

    it('should preserve safe content while removing dangerous parts', () => {
      const input = 'Hello <script>alert("xss")</script> world! This is a test.';
      const result = sanitizeInput(input);

      expect(result).toContain('Hello');
      expect(result).toContain('world!');
      expect(result).toContain('This is a test.');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });
  });

  describe('User input sanitization scenarios', () => {
    it('should sanitize user profile information', () => {
      const userProfile = {
        name: sanitizeForDisplay('John <script>alert(1)</script> Doe'),
        bio: sanitizeForDisplay('I love coding & web development!'),
        email: sanitizeEmail('john.doe@example.com'),
        website: sanitizeUrl('https://johndoe.dev'),
      };

      expect(userProfile.name).not.toContain('<script>');
      expect(userProfile.bio).toContain('&amp;');
      expect(userProfile.email).toBe('john.doe@example.com');
      expect(userProfile.website).toBe('https://johndoe.dev');
    });

    it('should sanitize form input data', () => {
      const formData = {
        jobTitle: sanitizeForDatabase('Senior Developer'),
        company: sanitizeForDatabase("O'Reilly Media"),
        description: sanitizeForDatabase('Looking for a <b>great</b> opportunity!'),
        skills: ['JavaScript', 'TypeScript', 'Vue.js'].map(skill => sanitizeForDatabase(skill)),
      };

      expect(formData.jobTitle).toBe('Senior Developer');
      expect(formData.company).toContain('O&#x27;Reilly Media');
      expect(formData.description).not.toContain('<b>');
      expect(formData.skills).toEqual(['JavaScript', 'TypeScript', 'Vue.js']);
    });
  });

  describe('File upload scenarios', () => {
    it('should sanitize uploaded file names', () => {
      const dangerousFileNames = [
        '../../../etc/passwd',
        'virus.exe',
        'script<script>.js',
        'file with spaces.txt',
        'résumé_français.pdf',
      ];

      const sanitizedNames = dangerousFileNames.map(name => sanitizeFileName(name));

      expect(sanitizedNames[0]).not.toContain('..');
      expect(sanitizedNames[1]).toBe('virus.exe');
      expect(sanitizedNames[2]).not.toContain('<script>');
      expect(sanitizedNames[3]).toBe('file with spaces.txt');
      expect(sanitizedNames[4]).toBe('résumé_français.pdf');
    });
  });

  describe('API input validation scenarios', () => {
    it('should validate and sanitize API request data', () => {
      const apiRequest = {
        jobOffer: sanitizeForDatabase('Full Stack Developer at <script>alert(1)</script> TechCorp'),
        requirements: sanitizeForDatabase('3+ years of experience with React'),
        salary: sanitizeForDatabase('$80,000 - $120,000'),
        contactEmail: sanitizeEmail('hr@techcorp.com'),
        applicationUrl: sanitizeUrl('https://techcorp.com/apply'),
      };

      expect(apiRequest.jobOffer).not.toContain('<script>');
      expect(apiRequest.requirements).toContain('React');
      expect(apiRequest.salary).toContain('$80,000');
      expect(apiRequest.contactEmail).toBe('hr@techcorp.com');
      expect(apiRequest.applicationUrl).toBe('https://techcorp.com/apply');
    });

    it('should handle edge cases in API data', () => {
      // Empty strings
      expect(sanitizeInput('')).toBe('');

      // Very long strings
      const longString = 'a'.repeat(20000);
      const sanitized = sanitizeInput(longString, { maxLength: 1000 });
      expect(sanitized.length).toBeLessThanOrEqual(1000);

      // Special characters
      const specialChars = 'Hello! @#$%^&*()_+-={}[]|\\:";\'<>?,./~`';
      const result = sanitizeInput(specialChars);
      expect(result).toContain('Hello!');
    });
  });

  describe('Error handling scenarios', () => {
    it('should handle invalid email formats gracefully', () => {
      const invalidEmails = [
        'not-an-email',
        'missing@domain',
        '@missing-local.com',
        'multiple@@symbols.com',
      ];

      invalidEmails.forEach(email => {
        expect(() => sanitizeEmail(email)).toThrow('Invalid email format');
      });
    });

    it('should handle invalid URLs gracefully', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://insecure.com',
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
      ];

      invalidUrls.forEach(url => {
        expect(() => sanitizeUrl(url)).toThrow();
      });
    });

    it('should handle non-string inputs gracefully', () => {
      expect(() => sanitizeInput(null as any)).toThrow('Input must be a string');
      expect(() => sanitizeInput(undefined as any)).toThrow('Input must be a string');
      expect(() => sanitizeInput(123 as any)).toThrow('Input must be a string');
    });
  });

  describe('Performance scenarios', () => {
    it('should handle multiple sanitization operations efficiently', () => {
      const startTime = Date.now();

      // Simulate processing 100 user inputs
      for (let i = 0; i < 100; i++) {
        sanitizeInput(`User input ${i} with <script>alert(${i})</script>`);
        sanitizeForDisplay(`Display text ${i}`);
        sanitizeForDatabase(`Database entry ${i}`);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 1 second)
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Configuration scenarios', () => {
    it('should respect different configuration options', () => {
      const input = 'Hello <script>alert(1)</script> world!';

      // Default configuration
      const defaultResult = sanitizeInput(input);
      expect(defaultResult).not.toContain('<script>');

      // Strict mode
      const strictResult = sanitizeInput('hello world', { strictMode: true });
      expect(strictResult).toBe('hello world');

      // Custom max length
      const longInput = 'a'.repeat(1000);
      const limitedResult = sanitizeInput(longInput, { maxLength: 100 });
      expect(limitedResult.length).toBeLessThanOrEqual(100);
    });
  });
});