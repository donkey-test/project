import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronDown, ChevronUp, ArrowRight, FileText } from 'lucide-react';
import { useScanContext } from '../context/ScanContext';
import ThreatChip from '../components/ThreatChip';
import { ScanResult } from '../types';

const Reports: React.FC = () => {
  const { scans } = useScanContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const generateReport = (scan: ScanResult) => {
    const report = `SENTINELX DEFENDER — SCAN REPORT
==================================
Scan ID:        ${scan.scan_id}
File:           ${scan.filename}
Timestamp:      ${scan.ts}
Threat Level:   ${scan.threat_level}
Confidence:     ${(scan.confidence_score * 100).toFixed(1)}%
Detection Path: ${scan.detection_path}

VERDICT
-------
${scan.llm_analysis.verdict}

AI ANALYSIS
-----------
${scan.llm_analysis.reasoning}

BEHAVIORAL FLAGS
----------------
${scan.llm_analysis.behavioral_flags.join('\n')}

AUTO-GENERATED YARA RULE
-------------------------
${scan.generated_yara_rule || 'N/A — no rule generated for benign files'}

RECOMMENDATION
--------------
${scan.recommendation}
`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinelx-report-${scan.scan_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBorderColor = (level: string) => {
    switch (level) {
      case 'MALICIOUS': return 'border-l-[3px] border-l-[#FF8C69]';
      case 'SUSPICIOUS': return 'border-l-[3px] border-l-[#F4D35E]';
      case 'SAFE': return 'border-l-[3px] border-l-[#9EFFBF]';
      default: return '';
    }
  };

  const reportsToShow = scans.slice(0, 20);

  return (
    <div className="min-h-screen pt-14 mosaic-bg" data-testid="reports-page">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-[#1A3C2B] mb-2">REPORTS</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">— SCAN DOCUMENTATION</p>
        </div>

        {reportsToShow.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-[1px] bg-[rgba(58,58,56,0.2)]">
            {reportsToShow.map((scan) => (
              <div 
                key={scan.scan_id} 
                className={`bg-white p-6 ${getBorderColor(scan.threat_level)}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-2">
                  REPORT
                </p>
                <h3 className="font-heading text-lg font-bold text-[#1A3C2B] mb-3">
                  REPORT-{scan.scan_id}
                </h3>
                <p className="font-mono text-[10px] text-[#6B6B68] mb-4">
                  {scan.filename} · <ThreatChip level={scan.threat_level} size="sm" /> · {scan.ts}
                </p>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="h-[6px] bg-[rgba(58,58,56,0.1)] border border-[rgba(58,58,56,0.1)]">
                    <div 
                      className="h-full bg-[#1A3C2B] transition-all duration-300"
                      style={{ width: `${scan.confidence_score * 100}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => generateReport(scan)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[rgba(58,58,56,0.2)] font-mono text-[10px] uppercase tracking-[0.1em] text-[#1A3C2B] hover:bg-[rgba(26,60,43,0.05)] transition-colors"
                    data-testid={`download-${scan.scan_id}`}
                  >
                    <Download className="w-3 h-3" />
                    Download .txt
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === scan.scan_id ? null : scan.scan_id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[rgba(58,58,56,0.2)] font-mono text-[10px] uppercase tracking-[0.1em] text-[#1A3C2B] hover:bg-[rgba(26,60,43,0.05)] transition-colors"
                    data-testid={`expand-${scan.scan_id}`}
                  >
                    {expandedId === scan.scan_id ? (
                      <><ChevronUp className="w-3 h-3" /> Hide Details</>
                    ) : (
                      <><ChevronDown className="w-3 h-3" /> View Details</>
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedId === scan.scan_id && (
                  <div className="mt-6 pt-6 border-t border-[rgba(58,58,56,0.1)]">
                    <div className="mb-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-2">AI ANALYSIS</p>
                      <p className="text-sm text-[#1A1A18] leading-relaxed">{scan.llm_analysis.reasoning}</p>
                    </div>
                    
                    {scan.llm_analysis.behavioral_flags.length > 0 && (
                      <div className="mb-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-2">BEHAVIORAL FLAGS</p>
                        <div className="flex flex-wrap gap-2">
                          {scan.llm_analysis.behavioral_flags.map((flag, i) => (
                            <span key={i} className="px-2 py-1 bg-[rgba(26,60,43,0.05)] font-mono text-[9px] text-[#1A3C2B]">
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {scan.generated_yara_rule && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-2">YARA RULE</p>
                        <pre className="code-block text-[10px] leading-relaxed whitespace-pre-wrap">
                          {scan.generated_yara_rule}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[rgba(58,58,56,0.2)] py-16 text-center">
            <FileText className="w-12 h-12 text-[rgba(26,60,43,0.2)] mx-auto mb-4" />
            <p className="text-[#6B6B68] mb-4">No reports yet</p>
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3C2B] text-white font-heading font-semibold text-sm uppercase tracking-wide hover:bg-[#2C4E3D] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Run Your First Scan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
