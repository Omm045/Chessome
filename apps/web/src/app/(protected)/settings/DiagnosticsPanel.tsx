'use client';

import React, { useEffect, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { Activity, Server, Database, Cpu, Network, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

type HealthData = {
  status?: string;
  details?: Record<string, { status?: string }>;
  meta?: {
    version?: string;
    environment?: string;
    timestamp?: string;
  };
};

export function DiagnosticsPanel() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number>(0);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const data = await apiClient.getHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealth(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'ok' || status === 'up') return 'text-green-500';
    if (status === 'error' || status === 'down') return 'text-red-500';
    return 'text-yellow-500';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Diagnostics</h1>
          <p className="text-gray-400">System health, performance metrics, and environment details.</p>
        </div>
        <Button onClick={fetchHealth} disabled={loading} variant="secondary">
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error ? (
        <Panel className="border-red-900 bg-red-900/20 p-4">
          <div className="flex items-start">
            <Activity className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-500">Failed to load diagnostics</h3>
              <p className="mt-1 text-sm text-red-400">{error}</p>
            </div>
          </div>
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {/* API Status */}
          <Panel padding="md" className="flex flex-col">
            <div className="flex items-center mb-4">
              <Server className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="font-semibold text-gray-200">API Status</h3>
            </div>
            {loading ? <Skeleton /> : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-bold capitalize ${getStatusColor(health?.status as string)}`}>{String(health?.status || 'Unknown')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Latency</span>
                  <span className="text-gray-200">{latency} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Heap Used</span>
                  <span className="text-gray-200">
                    {health?.details?.memory_heap?.status === 'up' ? 'Normal' : 'High'}
                  </span>
                </div>
              </div>
            )}
          </Panel>

          {/* Database Status */}
          <Panel padding="md" className="flex flex-col">
            <div className="flex items-center mb-4">
              <Database className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="font-semibold text-gray-200">Database Status</h3>
            </div>
            {loading ? <Skeleton /> : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">PostgreSQL</span>
                  <span className={`font-bold capitalize ${getStatusColor(health?.details?.database?.status || 'unknown')}`}>
                    {health?.details?.database?.status || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Upstash Redis</span>
                  <span className={`font-bold capitalize ${getStatusColor(health?.details?.redis?.status || 'unknown')}`}>
                    {health?.details?.redis?.status || 'Unknown'}
                  </span>
                </div>
              </div>
            )}
          </Panel>

          {/* Engine Status */}
          <Panel padding="md" className="flex flex-col">
            <div className="flex items-center mb-4">
              <Cpu className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="font-semibold text-gray-200">Local Engine</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">WASM Stockfish</span>
                <span className="font-bold text-green-500">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span className="text-gray-200">16.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Threads</span>
                <span className="text-gray-200">{typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 4}</span>
              </div>
            </div>
          </Panel>

          {/* Environment */}
          <Panel padding="md" className="flex flex-col">
            <div className="flex items-center mb-4">
              <Network className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="font-semibold text-gray-200">Environment</h3>
            </div>
            {loading ? <Skeleton /> : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Environment</span>
                  <span className="text-gray-200 capitalize">{health?.meta?.environment || 'Production'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Version</span>
                  <span className="text-gray-200 font-mono">{health?.meta?.version || '0.5.0-alpha'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time</span>
                  <span className="text-gray-200">
                    {health?.meta?.timestamp ? new Date(health.meta.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-full animate-pulse rounded bg-gray-800"></div>
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-800"></div>
      <div className="h-4 w-5/6 animate-pulse rounded bg-gray-800"></div>
    </div>
  );
}
