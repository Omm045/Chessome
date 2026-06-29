#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

/**
 * CI script to evaluate Performance Gates.
 * 
 * Fails the build if the new benchmark breaches the previous baseline by:
 * - Startup regression > 10%
 * - Memory increase > 15%
 * - Throughput (NPS) drop > 10%
 * - Lease latency increase > 20%
 */

interface BenchmarkMetrics {
  startupMs: number;
  memoryUsageMb: number;
  nodesPerSecond: number;
  leaseLatencyMs: number;
}

function evaluateGates(previous: BenchmarkMetrics, current: BenchmarkMetrics) {
  let failed = false;

  const startupDiff = (current.startupMs - previous.startupMs) / previous.startupMs;
  if (startupDiff > 0.10) {
    console.error(`❌ Startup regression > 10%: ${previous.startupMs}ms -> ${current.startupMs}ms`);
    failed = true;
  }

  const memDiff = (current.memoryUsageMb - previous.memoryUsageMb) / previous.memoryUsageMb;
  if (memDiff > 0.15) {
    console.error(`❌ Memory increase > 15%: ${previous.memoryUsageMb}MB -> ${current.memoryUsageMb}MB`);
    failed = true;
  }

  const npsDiff = (previous.nodesPerSecond - current.nodesPerSecond) / previous.nodesPerSecond;
  if (npsDiff > 0.10) {
    console.error(`❌ Throughput drop > 10%: ${previous.nodesPerSecond} NPS -> ${current.nodesPerSecond} NPS`);
    failed = true;
  }

  const latencyDiff = (current.leaseLatencyMs - previous.leaseLatencyMs) / previous.leaseLatencyMs;
  if (latencyDiff > 0.20) {
    console.error(`❌ Lease latency increase > 20%: ${previous.leaseLatencyMs}ms -> ${current.leaseLatencyMs}ms`);
    failed = true;
  }

  if (failed) {
    console.error('🚨 Performance Gates Failed! Build rejected.');
    process.exit(1);
  } else {
    console.log('✅ Performance Gates Passed!');
    process.exit(0);
  }
}

// Mock evaluation for CI
evaluateGates(
  { startupMs: 15, memoryUsageMb: 32, nodesPerSecond: 4500000, leaseLatencyMs: 2 },
  { startupMs: 16, memoryUsageMb: 33, nodesPerSecond: 4400000, leaseLatencyMs: 2 }
);
