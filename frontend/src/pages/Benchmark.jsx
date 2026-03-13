import React, { useState, useEffect } from 'react';
import { BarChart3, Play, RefreshCw, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getBenchmarkResults, runBenchmark } from '../lib/api';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';

const Benchmark = () => {
  const [results, setResults] = useState(null);
  const [liveResults, setLiveResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningLive, setRunningLive] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getBenchmarkResults();
        setResults(response.data);
      } catch (error) {
        toast.error('Failed to fetch benchmark results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleRunBenchmark = async () => {
    setRunningLive(true);
    try {
      const response = await runBenchmark(30);
      setLiveResults(response.data);
      toast.success('Live benchmark complete');
    } catch (error) {
      toast.error('Failed to run benchmark');
    } finally {
      setRunningLive(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-16 bg-paper-secondary w-1/3" />
          <div className="h-80 bg-paper-secondary" />
        </div>
      </div>
    );
  }

  const chartData = results ? [
    { metric: 'Accuracy', yara: results.yara_only.accuracy, ml: results.basic_ml.accuracy, sentinelx: results.sentinelx.accuracy },
    { metric: 'Precision', yara: results.yara_only.precision, ml: results.basic_ml.precision, sentinelx: results.sentinelx.precision },
    { metric: 'Recall', yara: results.yara_only.recall, ml: results.basic_ml.recall, sentinelx: results.sentinelx.recall },
    { metric: 'F1 Score', yara: results.yara_only.f1, ml: results.basic_ml.f1, sentinelx: results.sentinelx.f1 },
  ] : [];

  const scatterData = results ? [
    { name: 'YARA-Only', fpr: results.yara_only.fpr, fnr: results.yara_only.fnr, color: '#FF8C69' },
    { name: 'Basic-ML', fpr: results.basic_ml.fpr, fnr: results.basic_ml.fnr, color: '#F4D35E' },
    { name: 'SentinelX', fpr: results.sentinelx.fpr, fnr: results.sentinelx.fnr, color: '#1A3C2B' },
  ] : [];

  const improvements = results ? [
    { label: 'Recall Gain over YARA', value: `+${((results.sentinelx.recall - results.yara_only.recall) * 100).toFixed(2)}%`, color: 'mint' },
    { label: 'False Negative Reduction', value: `-${((results.yara_only.fnr - results.sentinelx.fnr) * 100).toFixed(2)}%`, color: 'coral' },
    { label: 'F1-Score Improvement', value: `+${((results.sentinelx.f1 - results.yara_only.f1) * 100).toFixed(2)}%`, color: 'gold' },
  ] : [];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12" data-testid="benchmark-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-hairline uppercase tracking-widest">03.</span>
          <h1 className="text-3xl font-heading font-bold text-forest">3-Way Detection Benchmark</h1>
        </div>
        <p className="font-mono text-sm text-hairline/60">
          Evaluated on n={results?.sample_count || 75} held-out test samples from 250-sample PE feature dataset
        </p>
      </div>

      {/* Improvement Cards */}
      <div className="grid md:grid-cols-3 gap-[1px] bg-hairline/20 mb-8">
        {improvements.map((item, index) => (
          <div key={item.label} className="bg-white p-6" data-testid={`improvement-card-${index}`}>
            <div className={`w-2 h-2 bg-${item.color} mb-4`} />
            <p className="text-3xl font-heading font-bold text-forest mb-2">{item.value}</p>
            <p className="font-mono text-[10px] text-hairline uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-white border border-hairline/20 p-6" data-testid="metrics-bar-chart">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Performance Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barGap={2} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3820" />
              <XAxis dataKey="metric" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} stroke="#3A3A38" />
              <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} stroke="#3A3A38" domain={[0, 1]} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #3A3A3820', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
              />
              <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 10 }} />
              <Bar dataKey="yara" name="YARA-Only" fill="#FF8C69" />
              <Bar dataKey="ml" name="Basic-ML" fill="#F4D35E" />
              <Bar dataKey="sentinelx" name="SentinelX" fill="#1A3C2B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter Chart */}
        <div className="bg-white border border-hairline/20 p-6" data-testid="fpr-fnr-scatter">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">FPR vs FNR Trade-off</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3820" />
              <XAxis type="number" dataKey="fpr" name="FPR" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} stroke="#3A3A38" domain={[0, 0.5]} label={{ value: 'False Positive Rate', position: 'bottom', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis type="number" dataKey="fnr" name="FNR" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} stroke="#3A3A38" domain={[0, 0.5]} label={{ value: 'False Negative Rate', angle: -90, position: 'left', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #3A3A3820', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
                formatter={(value) => value.toFixed(4)}
              />
              <Scatter data={scatterData} dataKey="fnr">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {scatterData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ background: item.color }} />
                <span className="font-mono text-[10px] text-hairline">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-white border border-hairline/20 overflow-hidden mb-8" data-testid="metrics-table">
        <table className="w-full">
          <thead>
            <tr className="border-b border-hairline/20 bg-paper-secondary">
              <th className="px-4 py-3 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">Approach</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">Accuracy</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">Precision</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">Recall</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">F1</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">FPR</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">FNR</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">AUC</th>
            </tr>
          </thead>
          <tbody>
            {results && [
              { name: 'YARA-Only', data: results.yara_only, color: 'coral' },
              { name: 'Basic-ML', data: results.basic_ml, color: 'gold' },
              { name: 'SentinelX', data: results.sentinelx, color: 'forest' },
            ].map((row) => (
              <tr key={row.name} className="border-b border-hairline/10 last:border-0 data-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 bg-${row.color}`} />
                    <span className="font-mono text-xs text-forest">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-hairline">{(row.data.accuracy * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-hairline">{(row.data.precision * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-hairline">{(row.data.recall * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-hairline">{(row.data.f1 * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-hairline">{(row.data.fpr * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-hairline">{(row.data.fnr * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-hairline">{row.data.auc.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Run Section */}
      <div className="bg-white border border-hairline/20 p-6" data-testid="live-run-section">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Live Benchmark Run</h3>
          </div>
          <Button
            onClick={handleRunBenchmark}
            disabled={runningLive}
            className="h-10 px-6 bg-forest hover:bg-forest-light rounded-xs font-mono text-xs uppercase tracking-widest"
            data-testid="run-benchmark-btn"
          >
            {runningLive ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run on 30 Samples
              </>
            )}
          </Button>
        </div>

        {liveResults && (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-coral/30 bg-coral/5">
                <p className="font-mono text-[10px] text-hairline uppercase mb-1">YARA Accuracy</p>
                <p className="text-2xl font-heading font-bold text-coral">{(liveResults.summary.yara_accuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="p-4 border border-gold/30 bg-gold/5">
                <p className="font-mono text-[10px] text-hairline uppercase mb-1">ML Accuracy</p>
                <p className="text-2xl font-heading font-bold text-gold">{(liveResults.summary.ml_accuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="p-4 border border-forest/30 bg-forest/5">
                <p className="font-mono text-[10px] text-hairline uppercase mb-1">SentinelX Accuracy</p>
                <p className="text-2xl font-heading font-bold text-forest">{(liveResults.summary.sentinelx_accuracy * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full" data-testid="live-results-table">
                <thead className="sticky top-0 bg-paper-secondary">
                  <tr className="border-b border-hairline/20">
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">SHA256</th>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">Actual</th>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">YARA</th>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">ML</th>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">SentinelX</th>
                  </tr>
                </thead>
                <tbody>
                  {liveResults.samples.map((sample, index) => (
                    <tr key={index} className="border-b border-hairline/10 last:border-0">
                      <td className="px-3 py-2 font-mono text-xs text-hairline">{sample.sha256}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 font-mono text-[10px] uppercase ${sample.actual_label === 'MALWARE' ? 'bg-coral/10 text-coral' : 'bg-mint/10 text-forest'}`}>
                          {sample.actual_label}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`font-mono text-xs ${sample.yara_correct ? 'text-forest' : 'text-coral'}`}>
                          {sample.yara_correct ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`font-mono text-xs ${sample.ml_correct ? 'text-forest' : 'text-coral'}`}>
                          {sample.ml_correct ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`font-mono text-xs ${sample.sentinelx_correct ? 'text-forest' : 'text-coral'}`}>
                          {sample.sentinelx_correct ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Benchmark;
