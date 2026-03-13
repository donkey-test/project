import React, { useState, useEffect } from 'react';
import { Cpu, Layers, GitBranch, Settings, BarChart3 } from 'lucide-react';
import { getModelInfo, getModelExplanation } from '../lib/api';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Model = () => {
  const [info, setInfo] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, featuresRes] = await Promise.all([
          getModelInfo(),
          getModelExplanation(),
        ]);
        setInfo(infoRes.data);
        setFeatures(featuresRes.data.top_features);
      } catch (error) {
        toast.error('Failed to fetch model information');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !info) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-16 bg-paper-secondary w-1/3" />
          <div className="h-64 bg-paper-secondary" />
        </div>
      </div>
    );
  }

  const fusionData = [
    { name: 'GBM', value: info.fusion_weights.gbm * 100, color: '#1A3C2B' },
    { name: 'LLM', value: info.fusion_weights.llm * 100, color: '#FF8C69' },
  ];

  const featureData = features.slice(0, 10).map((f) => ({
    feature: f.feature.replace(/_/g, ' '),
    importance: f.importance,
  }));

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12" data-testid="model-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-hairline uppercase tracking-widest">05.</span>
          <h1 className="text-3xl font-heading font-bold text-forest">Model Intelligence</h1>
        </div>
        <p className="font-mono text-sm text-hairline/60">{info.architecture.name} · {info.architecture.version}</p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-white border border-hairline/20 p-8 mb-8" data-testid="architecture-diagram">
        <div className="flex items-center gap-2 mb-6">
          <GitBranch className="w-4 h-4 text-forest" />
          <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Detection Pipeline</h3>
        </div>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {info.architecture.stages.map((stage, index) => (
            <React.Fragment key={stage.name}>
              <div className="text-center">
                <div className={`w-32 h-32 border-2 ${
                  stage.type === 'Static Analysis' ? 'border-coral bg-coral/5' :
                  stage.type === 'Machine Learning' ? 'border-forest bg-forest/5' :
                  stage.type === 'Heuristic' ? 'border-gold bg-gold/5' :
                  'border-mint bg-mint/5'
                } flex flex-col items-center justify-center`}>
                  {stage.type === 'Static Analysis' && <Layers className="w-6 h-6 mb-2 text-coral" />}
                  {stage.type === 'Machine Learning' && <Cpu className="w-6 h-6 mb-2 text-forest" />}
                  {stage.type === 'Heuristic' && <Settings className="w-6 h-6 mb-2 text-gold" />}
                  {stage.type === 'Ensemble' && <GitBranch className="w-6 h-6 mb-2 text-mint" />}
                  <p className="font-mono text-[10px] uppercase tracking-widest text-hairline">{stage.name}</p>
                  {stage.weight && (
                    <p className="font-heading font-bold text-forest mt-1">{(stage.weight * 100)}%</p>
                  )}
                </div>
                <p className="font-mono text-[9px] text-hairline/60 mt-2 max-w-[120px]">{stage.description}</p>
              </div>
              {index < info.architecture.stages.length - 1 && (
                <div className="w-8 h-[2px] bg-hairline/30 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Fusion Weights */}
        <div className="bg-white border border-hairline/20 p-6" data-testid="fusion-weights">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Fusion Weights</h3>
          </div>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={fusionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {fusionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #3A3A3820', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
                  formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              {fusionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4" style={{ background: item.color }} />
                    <span className="font-mono text-sm text-forest">{item.name} Model</span>
                  </div>
                  <span className="font-heading text-2xl font-bold text-forest">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-white border border-hairline/20 p-6" data-testid="feature-importance">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Top 10 Feature Importance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureData} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3820" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} stroke="#3A3A38" domain={[0, 0.2]} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} stroke="#3A3A38" width={110} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #3A3A3820', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
                formatter={(value) => value.toFixed(3)}
              />
              <Bar dataKey="importance" fill="#1A3C2B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Specs */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* GBM Params */}
        <div className="bg-white border border-hairline/20 p-6" data-testid="gbm-params">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">GBM Hyperparameters</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(info.gbm_params).map(([key, value]) => (
              <div key={key} className="p-3 bg-paper-secondary">
                <p className="font-mono text-[10px] text-hairline uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                <p className="font-heading text-xl font-bold text-forest">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Basic ML Params */}
        <div className="bg-white border border-hairline/20 p-6" data-testid="basic-ml-params">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-4 h-4 text-coral" />
            <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Basic ML (Baseline)</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(info.basic_ml_params).map(([key, value]) => (
              <div key={key} className="p-3 bg-coral/5 border border-coral/20">
                <p className="font-mono text-[10px] text-hairline uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                <p className="font-heading text-xl font-bold text-coral">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training Info */}
      <div className="bg-white border border-hairline/20 p-6" data-testid="training-info">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-4 h-4 text-forest" />
          <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Training Information</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(info.training_info).map(([key, value]) => (
            <div key={key} className="text-center p-4 border border-hairline/10">
              <p className="font-mono text-[10px] text-hairline uppercase mb-2">{key.replace(/_/g, ' ')}</p>
              <p className="font-heading text-lg font-bold text-forest">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Descriptions */}
      <div className="bg-white border border-hairline/20 p-6 mt-8" data-testid="feature-descriptions">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-4 h-4 text-forest" />
          <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest">Feature Descriptions</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {features.slice(0, 10).map((f) => (
            <div key={f.feature} className="flex items-start gap-3 p-3 bg-paper-secondary">
              <span className="font-mono text-[10px] text-forest bg-forest/10 px-2 py-1">#{f.rank}</span>
              <div>
                <p className="font-mono text-xs text-forest mb-1">{f.feature}</p>
                <p className="text-xs text-hairline/70">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Model;
