#!/usr/bin/env node

/**
 * Simple Performance Testing Script for Nuxt 4 Project
 *
 * Tests only the homepage with essential metrics according to PRD requirements
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// PRD Performance Thresholds
const THRESHOLDS = {
  performance: 85,
  accessibility: 90,
  bestPractices: 90,
  seo: 90,
  // Core Web Vitals (milliseconds)
  fcp: 1500,  // First Contentful Paint < 1.5s
  lcp: 2500,  // Largest Contentful Paint < 2.5s
  tti: 3000,  // Time to Interactive < 3s
  cls: 0.1    // Cumulative Layout Shift < 0.1
};

async function runSimplePerformanceTest() {
  console.log('🚀 Running Simple Performance Test...\n');

  // Check if server is running
  try {
    execSync('curl -f http://localhost:3000 > /dev/null 2>&1', { stdio: 'ignore' });
    console.log('✅ Server is running at http://localhost:3000');
  } catch {
    console.log('❌ Server not running. Please start with: pnpm dev');
    process.exit(1);
  }

  // Ensure reports directory exists
  const reportsDir = join(process.cwd(), 'reports');
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }

  console.log('📊 Running Lighthouse audit...\n');

  try {
    // Run simplified Lighthouse test
    const reportPath = join(reportsDir, 'lighthouse-homepage');

    const command = [
      'lighthouse',
      'http://localhost:3000',
      '--output=html',
      '--output=json',
      `--output-path="${reportPath}"`,
      '--chrome-flags="--no-sandbox --disable-dev-shm-usage --disable-extensions"',
      '--skip-audits=errors-in-console',
      '--quiet'
    ].join(' ');

    execSync(command, { stdio: 'inherit' });

    // Read and analyze results
    const jsonPath = join(reportsDir, 'lighthouse-homepage.json');
    if (existsSync(jsonPath)) {
      const fs = await import('fs');
      const reportData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

      analyzeResults(reportData);
      console.log(`\n📄 Detailed report: ${join(reportsDir, 'lighthouse-homepage.html')}`);
      console.log(`📊 JSON data: ${jsonPath}`);

    } else {
      console.log('⚠️  JSON report not found, but HTML report should be available');
    }

  } catch (error) {
    console.error('❌ Lighthouse test failed:', error.message);
    process.exit(1);
  }
}

function analyzeResults(report) {
  console.log('\n' + '='.repeat(60));
  console.log('📈 PERFORMANCE ANALYSIS');
  console.log('='.repeat(60));

  // Extract scores
  const categories = report.categories;
  const audits = report.audits;

  const scores = {
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility.score * 100),
    bestPractices: Math.round(categories['best-practices'].score * 100),
    seo: Math.round(categories.seo.score * 100)
  };

  // Extract Core Web Vitals
  const metrics = {
    fcp: Math.round(audits['first-contentful-paint']?.numericValue || 0),
    lcp: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
    tti: Math.round(audits['interactive']?.numericValue || 0),
    cls: audits['cumulative-layout-shift']?.numericValue || 0
  };

  // Display results with pass/fail
  console.log('\n🏆 LIGHTHOUSE SCORES:');
  displayScore('Performance', scores.performance, THRESHOLDS.performance);
  displayScore('Accessibility', scores.accessibility, THRESHOLDS.accessibility);
  displayScore('Best Practices', scores.bestPractices, THRESHOLDS.bestPractices);
  displayScore('SEO', scores.seo, THRESHOLDS.seo);

  console.log('\n⚡ CORE WEB VITALS:');
  displayMetric('First Contentful Paint', metrics.fcp, THRESHOLDS.fcp, 'ms');
  displayMetric('Largest Contentful Paint', metrics.lcp, THRESHOLDS.lcp, 'ms');
  displayMetric('Time to Interactive', metrics.tti, THRESHOLDS.tti, 'ms');
  displayMetric('Cumulative Layout Shift', metrics.cls, THRESHOLDS.cls, '');

  // Overall assessment
  const failures = [];

  if (scores.performance < THRESHOLDS.performance) failures.push(`Performance: ${scores.performance}`);
  if (scores.accessibility < THRESHOLDS.accessibility) failures.push(`Accessibility: ${scores.accessibility}`);
  if (scores.bestPractices < THRESHOLDS.bestPractices) failures.push(`Best Practices: ${scores.bestPractices}`);
  if (scores.seo < THRESHOLDS.seo) failures.push(`SEO: ${scores.seo}`);

  if (metrics.fcp > THRESHOLDS.fcp) failures.push(`FCP: ${metrics.fcp}ms`);
  if (metrics.lcp > THRESHOLDS.lcp) failures.push(`LCP: ${metrics.lcp}ms`);
  if (metrics.tti > THRESHOLDS.tti) failures.push(`TTI: ${metrics.tti}ms`);
  if (metrics.cls > THRESHOLDS.cls) failures.push(`CLS: ${metrics.cls.toFixed(3)}`);

  console.log('\n' + '='.repeat(60));

  if (failures.length === 0) {
    console.log('✅ ALL TESTS PASSED! 🎉');
    console.log('🏆 Application meets all performance benchmarks from PRD');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('\n📋 Failed metrics:');
    failures.forEach(failure => console.log(`   • ${failure}`));

    console.log('\n💡 Optimization suggestions:');
    if (scores.performance < THRESHOLDS.performance) {
      console.log('   🚀 Performance: Optimize images, reduce bundle size, enable code splitting');
    }
    if (metrics.fcp > THRESHOLDS.fcp) {
      console.log('   ⚡ FCP: Inline critical CSS, preload fonts, reduce server response time');
    }
    if (metrics.lcp > THRESHOLDS.lcp) {
      console.log('   🖼️  LCP: Optimize hero image, use WebP format, implement lazy loading');
    }
    if (metrics.tti > THRESHOLDS.tti) {
      console.log('   📦 TTI: Reduce JavaScript payload, defer non-critical scripts');
    }
  }

  console.log('\n📚 PRD Requirements Status:');
  console.log('   ⏱️  Time to Interactive < 3s:', metrics.tti <= THRESHOLDS.tti ? '✅' : '❌');
  console.log('   🎨 First Contentful Paint < 1.5s:', metrics.fcp <= THRESHOLDS.fcp ? '✅' : '❌');
  console.log('   🏆 Lighthouse Performance > 85:', scores.performance >= THRESHOLDS.performance ? '✅' : '❌');

  return failures.length === 0;
}

function displayScore(name, score, threshold) {
  const icon = score >= threshold ? '✅' : '❌';
  const status = score >= threshold ? 'PASS' : 'FAIL';
  console.log(`   ${icon} ${name}: ${score}/100 (threshold: ${threshold}) - ${status}`);
}

function displayMetric(name, value, threshold, unit) {
  const icon = value <= threshold ? '✅' : '❌';
  const status = value <= threshold ? 'PASS' : 'FAIL';
  const displayValue = unit === '' ? value.toFixed(3) : value;
  console.log(`   ${icon} ${name}: ${displayValue}${unit} (threshold: ≤${threshold}${unit}) - ${status}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSimplePerformanceTest().catch(console.error);
}

export { runSimplePerformanceTest };