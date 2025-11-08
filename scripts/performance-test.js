#!/usr/bin/env node

/**
 * Performance Testing Script
 *
 * This script runs comprehensive performance tests using Lighthouse
 * and validates against the performance benchmarks defined in the PRD.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const PERFORMANCE_THRESHOLDS = {
  // PRD Requirements
  performance: 85,        // Lighthouse performance score > 85
  accessibility: 90,      // Accessibility score > 90
  bestPractices: 90,      // Best practices score > 90
  seo: 90,               // SEO score > 90

  // Core Web Vitals (PRD: FCP < 1.5s, TTI < 3s)
  firstContentfulPaint: 1500,     // milliseconds
  timeToInteractive: 3000,        // milliseconds
  largestContentfulPaint: 2500,   // milliseconds
  cumulativeLayoutShift: 0.1      // score
};

const URLS_TO_TEST = [
  'http://localhost:3000',           // Landing page
  'http://localhost:3000/dashboard' // Dashboard (if exists)
];

async function runLighthouseTests() {
  console.log('🚀 Starting Performance Tests...\n');

  // Ensure reports directory exists
  const reportsDir = join(process.cwd(), 'reports');
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }

  const results = [];

  for (const url of URLS_TO_TEST) {
    console.log(`📊 Testing: ${url}`);

    try {
      // Run Lighthouse
      const reportPath = join(reportsDir, `lighthouse-${url.replace(/[^a-zA-Z0-9]/g, '-')}.html`);
      const jsonPath = join(reportsDir, `lighthouse-${url.replace(/[^a-zA-Z0-9]/g, '-')}.json`);

      execSync(`lighthouse "${url}" --output=html --output=json --output-path="${reportPath.replace('.html', '')}" --chrome-flags="--no-sandbox --disable-dev-shm-usage" --disable-extensions --quiet --skip-audits=errors-in-console`, {
        stdio: 'inherit'
      });

      // Read and parse results
      const reportJson = JSON.parse(readFileSync(jsonPath, 'utf8'));

      const scores = {
        performance: Math.round(reportJson.categories.performance.score * 100),
        accessibility: Math.round(reportJson.categories.accessibility.score * 100),
        bestPractices: Math.round(reportJson.categories['best-practices'].score * 100),
        seo: Math.round(reportJson.categories.seo.score * 100)
      };

      const metrics = {
        firstContentfulPaint: reportJson.audits['first-contentful-paint'].numericValue,
        timeToInteractive: reportJson.audits['interactive'].numericValue,
        largestContentfulPaint: reportJson.audits['largest-contentful-paint'].numericValue,
        cumulativeLayoutShift: reportJson.audits['cumulative-layout-shift'].numericValue
      };

      results.push({
        url,
        scores,
        metrics,
        reportPath,
        timestamp: new Date().toISOString()
      });

      // Display results
      console.log(`✨ Results for ${url}:`);
      console.log(`   Performance: ${scores.performance}/100 (threshold: ${PERFORMANCE_THRESHOLDS.performance})`);
      console.log(`   Accessibility: ${scores.accessibility}/100 (threshold: ${PERFORMANCE_THRESHOLDS.accessibility})`);
      console.log(`   Best Practices: ${scores.bestPractices}/100 (threshold: ${PERFORMANCE_THRESHOLDS.bestPractices})`);
      console.log(`   SEO: ${scores.seo}/100 (threshold: ${PERFORMANCE_THRESHOLDS.seo})`);
      console.log(`   FCP: ${Math.round(metrics.firstContentfulPaint)}ms (threshold: ${PERFORMANCE_THRESHOLDS.firstContentfulPaint}ms)`);
      console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms (threshold: ${PERFORMANCE_THRESHOLDS.timeToInteractive}ms)`);
      console.log(`   LCP: ${Math.round(metrics.largestContentfulPaint)}ms (threshold: ${PERFORMANCE_THRESHOLDS.largestContentfulPaint}ms)`);
      console.log(`   CLS: ${metrics.cumulativeLayoutShift.toFixed(3)} (threshold: ${PERFORMANCE_THRESHOLDS.cumulativeLayoutShift})`);
      console.log(`   📄 Report: ${reportPath}\n`);

    } catch (error) {
      console.error(`❌ Failed to test ${url}:`, error.message);
      results.push({
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
}

function validateResults(results) {
  console.log('🔍 Validating Performance Results...\n');

  let allPassed = true;
  const failures = [];

  for (const result of results) {
    if (result.error) {
      allPassed = false;
      failures.push(`${result.url}: Test failed - ${result.error}`);
      continue;
    }

    const { url, scores, metrics } = result;

    // Check Lighthouse scores
    if (scores.performance < PERFORMANCE_THRESHOLDS.performance) {
      allPassed = false;
      failures.push(`${url}: Performance score ${scores.performance} < ${PERFORMANCE_THRESHOLDS.performance}`);
    }

    if (scores.accessibility < PERFORMANCE_THRESHOLDS.accessibility) {
      allPassed = false;
      failures.push(`${url}: Accessibility score ${scores.accessibility} < ${PERFORMANCE_THRESHOLDS.accessibility}`);
    }

    if (scores.bestPractices < PERFORMANCE_THRESHOLDS.bestPractices) {
      allPassed = false;
      failures.push(`${url}: Best Practices score ${scores.bestPractices} < ${PERFORMANCE_THRESHOLDS.bestPractices}`);
    }

    if (scores.seo < PERFORMANCE_THRESHOLDS.seo) {
      allPassed = false;
      failures.push(`${url}: SEO score ${scores.seo} < ${PERFORMANCE_THRESHOLDS.seo}`);
    }

    // Check Core Web Vitals
    if (metrics.firstContentfulPaint > PERFORMANCE_THRESHOLDS.firstContentfulPaint) {
      allPassed = false;
      failures.push(`${url}: FCP ${Math.round(metrics.firstContentfulPaint)}ms > ${PERFORMANCE_THRESHOLDS.firstContentfulPaint}ms`);
    }

    if (metrics.timeToInteractive > PERFORMANCE_THRESHOLDS.timeToInteractive) {
      allPassed = false;
      failures.push(`${url}: TTI ${Math.round(metrics.timeToInteractive)}ms > ${PERFORMANCE_THRESHOLDS.timeToInteractive}ms`);
    }

    if (metrics.largestContentfulPaint > PERFORMANCE_THRESHOLDS.largestContentfulPaint) {
      allPassed = false;
      failures.push(`${url}: LCP ${Math.round(metrics.largestContentfulPaint)}ms > ${PERFORMANCE_THRESHOLDS.largestContentfulPaint}ms`);
    }

    if (metrics.cumulativeLayoutShift > PERFORMANCE_THRESHOLDS.cumulativeLayoutShift) {
      allPassed = false;
      failures.push(`${url}: CLS ${metrics.cumulativeLayoutShift.toFixed(3)} > ${PERFORMANCE_THRESHOLDS.cumulativeLayoutShift}`);
    }
  }

  return { allPassed, failures };
}

function generateReport(results, validation) {
  const reportData = {
    timestamp: new Date().toISOString(),
    passed: validation.allPassed,
    summary: {
      totalTests: results.length,
      passed: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length
    },
    thresholds: PERFORMANCE_THRESHOLDS,
    results,
    failures: validation.failures
  };

  const reportPath = join(process.cwd(), 'reports', 'performance-summary.json');
  writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

  console.log(`📊 Performance Report generated: ${reportPath}`);

  return reportData;
}

async function main() {
  try {
    // Check if server is running
    try {
      execSync('curl -f http://localhost:3000 > /dev/null 2>&1', { stdio: 'ignore' });
    } catch {
      console.log('⚠️  Server not running. Please start with: pnpm dev');
      console.log('   Then run this script again.');
      process.exit(1);
    }

    const results = await runLighthouseTests();
    const validation = validateResults(results);
    generateReport(results, validation);

    console.log('\n' + '='.repeat(60));

    if (validation.allPassed) {
      console.log('✅ All performance tests PASSED!');
      console.log('🎉 Application meets all performance benchmarks.');
    } else {
      console.log('❌ Performance tests FAILED!');
      console.log('\n📋 Failures:');
      validation.failures.forEach(failure => {
        console.log(`   • ${failure}`);
      });
    }

    console.log('\n📈 Next Steps:');
    console.log('   • Review detailed reports in ./reports/');
    console.log('   • Open HTML reports in browser for detailed analysis');
    console.log('   • Focus on failed metrics for optimization');

    process.exit(validation.allPassed ? 0 : 1);

  } catch (error) {
    console.error('❌ Performance testing failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}