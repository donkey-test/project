import React, { useState } from 'react';
import { Upload, Play, RefreshCw, AlertTriangle, CheckCircle, XCircle, Code, Shield, Brain, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { analyzeFeatures } from '../lib/api';
import { toast } from 'sonner';

const defaultFeatures = {
  file_entropy: 5.5,
  num_sections: 5,
  num_imports: 50,
  num_strings: 200,
  section_entropy_avg: 5.0,
  overlay_ratio: 0.1,
  resource_entropy: 4.0,
  file_size_kb: 500,
  import_entropy: 4.5,
  has_packing_artifacts: false,
  pe_timestamp_anomaly: false,
  has_debug_info: true,
  num_exports: 0,
  has_upx_signature: false,
  suspicious_import_count: 2,
  suspicious_string_count: 5,
  anti_debug_calls: 0,
  network_indicators: 1,
  registry_indicators: 1,
  high_entropy_sections: 1,
};

const Scanner = () => {
  const [features, setFeatures] = useState(defaultFeatures);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await analyzeFeatures(features);
      setResult(response.data);
      toast.success('Analysis complete');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFeatures(defaultFeatures);
    setResult(null);
  };

  const updateFeature = (key, value) => {
    setFeatures((prev) => ({ ...prev, [key]: value }));
  };

  const getThreatIcon = () => {
    if (!result) return null;
    switch (result.threat_level) {
      case 'MALICIOUS': return <XCircle className="w-12 h-12 text-coral" />;
      case 'SUSPICIOUS': return <AlertTriangle className="w-12 h-12 text-gold" />;
      case 'SAFE': return <CheckCircle className="w-12 h-12 text-forest" />;
      default: return null;
    }
  };

  const getThreatColor = () => {
    if (!result) return '';
    switch (result.threat_level) {
      case 'MALICIOUS': return 'bg-coral text-white';
      case 'SUSPICIOUS': return 'bg-gold text-forest';
      case 'SAFE': return 'bg-mint text-forest';
      default: return '';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12" data-testid="scanner-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-hairline uppercase tracking-widest">02.</span>
          <h1 className="text-3xl font-heading font-bold text-forest">File Scanner</h1>
        </div>
        <p className="font-mono text-sm text-hairline/60">Command Center · Analyze PE file feature vectors</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT PANEL - Input */}
        <div className="space-y-6">
          {/* Upload Zone */}
          <div className="bg-white border border-dashed border-hairline/40 p-8 text-center corner-markers">
            <Upload className="w-8 h-8 text-hairline/40 mx-auto mb-4" />
            <p className="font-mono text-xs text-hairline uppercase tracking-widest mb-2">
              Drag & Drop .exe / .dll / .sys
            </p>
            <p className="font-mono text-[10px] text-hairline/40">
              File upload simulated - use feature vector form below
            </p>
          </div>

          {/* Feature Vector Form */}
          <div className="bg-white border border-hairline/20 p-6" data-testid="feature-form">
            <h3 className="font-mono text-[10px] text-forest uppercase tracking-widest mb-6 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Analyze Feature Vector
            </h3>

            {/* Numeric Inputs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">File Entropy</Label>
                <Slider
                  value={[features.file_entropy]}
                  min={0}
                  max={8}
                  step={0.1}
                  onValueChange={([v]) => updateFeature('file_entropy', v)}
                  data-testid="slider-file-entropy"
                />
                <span className="font-mono text-xs text-forest mt-1 block">{features.file_entropy.toFixed(1)}</span>
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Sections</Label>
                <Input
                  type="number"
                  value={features.num_sections}
                  onChange={(e) => updateFeature('num_sections', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                  data-testid="input-num-sections"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Imports</Label>
                <Input
                  type="number"
                  value={features.num_imports}
                  onChange={(e) => updateFeature('num_imports', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                  data-testid="input-num-imports"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Strings</Label>
                <Input
                  type="number"
                  value={features.num_strings}
                  onChange={(e) => updateFeature('num_strings', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                  data-testid="input-num-strings"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Section Entropy</Label>
                <Slider
                  value={[features.section_entropy_avg]}
                  min={0}
                  max={8}
                  step={0.1}
                  onValueChange={([v]) => updateFeature('section_entropy_avg', v)}
                />
                <span className="font-mono text-xs text-forest mt-1 block">{features.section_entropy_avg.toFixed(1)}</span>
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Overlay Ratio</Label>
                <Slider
                  value={[features.overlay_ratio]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([v]) => updateFeature('overlay_ratio', v)}
                />
                <span className="font-mono text-xs text-forest mt-1 block">{features.overlay_ratio.toFixed(2)}</span>
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Resource Entropy</Label>
                <Slider
                  value={[features.resource_entropy]}
                  min={0}
                  max={8}
                  step={0.1}
                  onValueChange={([v]) => updateFeature('resource_entropy', v)}
                />
                <span className="font-mono text-xs text-forest mt-1 block">{features.resource_entropy.toFixed(1)}</span>
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">File Size (KB)</Label>
                <Input
                  type="number"
                  value={features.file_size_kb}
                  onChange={(e) => updateFeature('file_size_kb', parseFloat(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                  data-testid="input-file-size"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Import Entropy</Label>
                <Slider
                  value={[features.import_entropy]}
                  min={0}
                  max={8}
                  step={0.1}
                  onValueChange={([v]) => updateFeature('import_entropy', v)}
                />
                <span className="font-mono text-xs text-forest mt-1 block">{features.import_entropy.toFixed(1)}</span>
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Exports</Label>
                <Input
                  type="number"
                  value={features.num_exports}
                  onChange={(e) => updateFeature('num_exports', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Suspicious Imports</Label>
                <Input
                  type="number"
                  value={features.suspicious_import_count}
                  onChange={(e) => updateFeature('suspicious_import_count', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                  data-testid="input-suspicious-imports"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Suspicious Strings</Label>
                <Input
                  type="number"
                  value={features.suspicious_string_count}
                  onChange={(e) => updateFeature('suspicious_string_count', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Anti-Debug Calls</Label>
                <Input
                  type="number"
                  value={features.anti_debug_calls}
                  onChange={(e) => updateFeature('anti_debug_calls', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                  data-testid="input-anti-debug"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Network Indicators</Label>
                <Input
                  type="number"
                  value={features.network_indicators}
                  onChange={(e) => updateFeature('network_indicators', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">Registry Indicators</Label>
                <Input
                  type="number"
                  value={features.registry_indicators}
                  onChange={(e) => updateFeature('registry_indicators', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                />
              </div>
              <div>
                <Label className="font-mono text-[10px] text-hairline uppercase mb-2 block">High Entropy Sections</Label>
                <Input
                  type="number"
                  value={features.high_entropy_sections}
                  onChange={(e) => updateFeature('high_entropy_sections', parseInt(e.target.value) || 0)}
                  className="h-9 font-mono text-sm rounded-none border-hairline/20"
                />
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-hairline/10 pt-6">
              <div className="flex items-center justify-between">
                <Label className="font-mono text-[10px] text-hairline uppercase">Packing Artifacts</Label>
                <Switch
                  checked={features.has_packing_artifacts}
                  onCheckedChange={(v) => updateFeature('has_packing_artifacts', v)}
                  data-testid="switch-packing"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-mono text-[10px] text-hairline uppercase">PE Timestamp Anomaly</Label>
                <Switch
                  checked={features.pe_timestamp_anomaly}
                  onCheckedChange={(v) => updateFeature('pe_timestamp_anomaly', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-mono text-[10px] text-hairline uppercase">Debug Info</Label>
                <Switch
                  checked={features.has_debug_info}
                  onCheckedChange={(v) => updateFeature('has_debug_info', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-mono text-[10px] text-hairline uppercase">UPX Signature</Label>
                <Switch
                  checked={features.has_upx_signature}
                  onCheckedChange={(v) => updateFeature('has_upx_signature', v)}
                  data-testid="switch-upx"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-hairline/10">
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 h-12 bg-forest hover:bg-forest-light rounded-xs font-mono text-xs uppercase tracking-widest"
                data-testid="analyze-btn"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-12 px-6 border-hairline/20 rounded-xs font-mono text-xs uppercase tracking-widest"
                data-testid="reset-btn"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Threat Level Badge */}
              <div className={`p-8 ${getThreatColor()} corner-markers`} data-testid="threat-level-badge">
                <div className="flex items-center gap-6">
                  {getThreatIcon()}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-1">Threat Level</p>
                    <p className="text-4xl font-heading font-bold">{result.threat_level}</p>
                  </div>
                </div>
              </div>

              {/* Confidence Gauge */}
              <div className="bg-white border border-hairline/20 p-6" data-testid="confidence-gauge">
                <p className="font-mono text-[10px] text-hairline uppercase tracking-widest mb-4">Confidence Score</p>
                <div className="flex items-end gap-4">
                  <p className="text-5xl font-heading font-bold text-forest">{result.confidence_score.toFixed(1)}%</p>
                  <div className="flex-1 h-4 bg-paper-secondary overflow-hidden">
                    <div
                      className="h-full bg-forest transition-all duration-500"
                      style={{ width: `${result.confidence_score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Detection Path */}
              <div className="bg-white border border-hairline/20 p-6" data-testid="detection-path">
                <div className="flex items-center gap-2 mb-4">
                  <ChevronRight className="w-4 h-4 text-forest" />
                  <p className="font-mono text-[10px] text-forest uppercase tracking-widest">{result.detection_path}</p>
                </div>
                <p className="text-sm text-hairline leading-relaxed">{result.detection_explanation}</p>
              </div>

              {/* YARA Rules */}
              {result.yara_rules_matched.length > 0 && (
                <div className="bg-white border border-hairline/20 p-6" data-testid="yara-rules">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-coral" />
                    <p className="font-mono text-[10px] text-hairline uppercase tracking-widest">YARA Rules Matched</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.yara_rules_matched.map((rule) => (
                      <span key={rule} className="px-3 py-1.5 bg-coral/10 text-coral font-mono text-xs">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* LLM Analysis */}
              <div className="bg-white border border-hairline/20 p-6" data-testid="llm-analysis">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-forest" />
                  <p className="font-mono text-[10px] text-hairline uppercase tracking-widest">LLM Analysis</p>
                </div>
                <p className="text-sm font-medium text-forest mb-3">{result.llm_verdict}</p>
                <p className="text-sm text-hairline leading-relaxed mb-4">{result.llm_reasoning}</p>
                {result.behavioral_flags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {result.behavioral_flags.map((flag) => (
                      <span key={flag} className="px-2 py-1 bg-gold/10 text-gold font-mono text-[10px] uppercase">
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Generated YARA Rule */}
              {result.generated_yara_rule && (
                <div className="bg-forest p-6" data-testid="generated-yara">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-4 h-4 text-mint" />
                    <p className="font-mono text-[10px] text-white/80 uppercase tracking-widest">Auto-Generated YARA Rule</p>
                  </div>
                  <pre className="font-mono text-xs text-mint/90 whitespace-pre-wrap overflow-x-auto">
                    {result.generated_yara_rule}
                  </pre>
                </div>
              )}

              {/* Recommendation */}
              <div className={`p-6 border-l-4 ${
                result.threat_level === 'MALICIOUS' ? 'bg-coral/10 border-coral' :
                result.threat_level === 'SUSPICIOUS' ? 'bg-gold/10 border-gold' :
                'bg-mint/10 border-forest'
              }`} data-testid="recommendation">
                <p className="font-mono text-[10px] text-hairline uppercase tracking-widest mb-2">Recommendation</p>
                <p className="text-sm text-forest font-medium">{result.recommendation}</p>
              </div>
            </>
          ) : (
            <div className="bg-white border border-hairline/20 p-12 text-center">
              <Shield className="w-16 h-16 text-hairline/20 mx-auto mb-4" />
              <p className="font-mono text-sm text-hairline uppercase tracking-widest mb-2">Awaiting Analysis</p>
              <p className="text-sm text-hairline/60">Configure feature vector and click Analyze</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
