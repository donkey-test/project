import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { useScanContext } from '../context/ScanContext';
import ThreatChip from '../components/ThreatChip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts';

const ThreatFeed: React.FC = () => {
  const { scans } = useScanContext();

  const maliciousCount = scans.filter(s => s.threat_level === 'MALICIOUS').length;
  const safeCount = scans.filter(s => s.threat_level === 'SAFE').length;
  const suspiciousCount = scans.filter(s => s.threat_level === 'SUSPICIOUS').length;

  const chartData = scans.slice(0, 20).map((scan, index) => ({
    index: index + 1,
    confidence: scan.confidence_score * 100,
    threat_level: scan.threat_level,
  }));

  const getBarColor = (threatLevel: string) => {
    switch (threatLevel) {
      case 'MALICIOUS': return '#FF8C69';
      case 'SUSPICIOUS': return '#F4D35E';
      case 'SAFE': return '#9EFFBF';
      default: return '#1A3C2B';
    }
  };

  return (
    <div className="min-h-screen pt-14 mosaic-bg" data-testid="threats-page">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-[#1A3C2B] mb-2">THREAT FEED</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">— LIVE DETECTION ACTIVITY</p>
        </div>

        {/* Summary Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[rgba(58,58,56,0.2)] bg-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">Total Scans:</span>
            <span className="font-heading font-bold text-[#1A3C2B]">{scans.length}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[rgba(58,58,56,0.2)] bg-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">Malicious:</span>
            <span className="font-heading font-bold text-[#FF8C69]">{maliciousCount}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[rgba(58,58,56,0.2)] bg-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">Safe:</span>
            <span className="font-heading font-bold text-[#1A3C2B]">{safeCount}</span>
          </div>
        </div>

        {/* Feed Table */}
        <div className="bg-white border border-[rgba(58,58,56,0.2)] mb-8">
          {scans.length > 0 ? (
            <table className="data-table" data-testid="threat-feed-table">
              <thead>
                <tr>
                  <th>SCAN ID</th>
                  <th>FILE</th>
                  <th>THREAT</th>
                  <th>CONFIDENCE</th>
                  <th>DETECTION PATH</th>
                  <th>TIME</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan) => (
                  <tr key={scan.scan_id}>
                    <td className="font-mono text-[10px] text-[#6B6B68]">{scan.scan_id}</td>
                    <td className="text-[13px]">{scan.filename}</td>
                    <td><ThreatChip level={scan.threat_level} size="sm" /></td>
                    <td 
                      className="font-mono text-[11px]"
                      style={{ 
                        color: scan.threat_level === 'MALICIOUS' ? '#FF8C69' : 
                               scan.threat_level === 'SUSPICIOUS' ? '#F4D35E' : '#1A3C2B' 
                      }}
                    >
                      {(scan.confidence_score * 100).toFixed(1)}%
                    </td>
                    <td className="font-mono text-[9px] text-[#6B6B68]">
                      PATH {scan.detection_path === 'YARA_STATIC' ? 'A' : 'B'}
                    </td>
                    <td className="font-mono text-[9px] text-[#6B6B68]">{scan.ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center">
              <Shield className="w-12 h-12 text-[rgba(26,60,43,0.2)] mx-auto mb-4" />
              <p className="text-[#6B6B68] mb-4">No threat activity yet</p>
              <Link
                to="/scanner"
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#1A3C2B] hover:underline"
              >
                <ArrowRight className="w-3 h-3" />
                Go to Scanner
              </Link>
            </div>
          )}
        </div>

        {/* Confidence Distribution Chart */}
        {scans.length > 0 && (
          <div className="bg-white border border-[rgba(58,58,56,0.2)] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-4">CONFIDENCE DISTRIBUTION</p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" barSize={12}>
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#6B6B68' }}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={{ stroke: 'rgba(58,58,56,0.2)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="index"
                    tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#6B6B68' }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid rgba(58,58,56,0.2)', 
                      borderRadius: 0,
                      fontFamily: 'JetBrains Mono',
                      fontSize: 10,
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Confidence']}
                  />
                  <Bar dataKey="confidence" radius={[0, 2, 2, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.threat_level)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatFeed;
