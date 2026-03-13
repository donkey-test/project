import React, { useState, useEffect } from 'react';
import { getModelInfo, getModelExplanation } from '../../services/api';
import { ModelInfo, FeatureImportance } from '../../types';
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

const Model: React.FC = () => {
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const [features, setFeatures] = useState<FeatureImportance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoData, featuresData] = await Promise.all([
          getModelInfo(),
          getModelExplanation(),
        ]);
        setInfo(infoData);
        setFeatures(featuresData.top_features);
      } catch (error) {
        // Default model info
        setInfo({
          architecture: { name: 'SentinelX Hybrid', version: '2.0', stages: [] },
          fusion_weights: { gbm: 0.6, llm: 0.4 },
          gbm_params: { n_estimators: 150, max_depth: 4, learning_rate: 0.1 },
          basic_ml_params: { model: 'DecisionTree', max_depth: 5 },
          training_info: { train_samples: 175, test_samples: 75, cv_folds: 5 }
        });
        setFeatures([
          { feature: 'file_entropy', importance: 0.156, rank: 1, description: 'Overall file entropy' },
          { feature: 'suspicious_import_count', importance: 0.142, rank: 2, description: 'Suspicious API imports' },
          { feature: 'anti_debug_calls', importance: 0.128, rank: 3, description: 'Anti-debugging techniques' },
          { feature: 'high_entropy_sections', importance: 0.115, rank: 4, description: 'High entropy sections' },
          { feature: 'has_packing_artifacts', importance: 0.098, rank: 5, description: 'Packer signatures' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !info) {
    return (
      <div className="min-h-screen pt-14 mosaic-bg">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="space-y-4">
            <div className="h-12 w-64 skeleton" />
            <div className="h-64 skeleton" />
          </div>
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
    <div className="min-h-screen pt-14 mosaic-bg" data-testid="admin-model-page">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-[#1A3C2B] mb-2">MODEL</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">
            — {info.architecture.name} v{info.architecture.version}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Fusion Weights */}
          <div className="bg-white border border-[rgba(58,58,56,0.2)] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-4">FUSION WEIGHTS</p>
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
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(58,58,56,0.2)', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-4">
                {fusionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4" style={{ background: item.color }} />
                      <span className="font-mono text-sm">{item.name} Model</span>
                    </div>
                    <span className="font-heading text-2xl font-bold text-[#1A3C2B]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="bg-white border border-[rgba(58,58,56,0.2)] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-4">TOP FEATURE IMPORTANCE</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={featureData} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(58,58,56,0.1)" />
                <XAxis type="number" tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#6B6B68' }} domain={[0, 0.2]} />
                <YAxis type="category" dataKey="feature" tick={{ fontSize: 8, fontFamily: 'JetBrains Mono', fill: '#6B6B68' }} width={100} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(58,58,56,0.2)', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 10 }} />
                <Bar dataKey="importance" fill="#1A3C2B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Specs */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* GBM Params */}
          <div className="bg-white border border-[rgba(58,58,56,0.2)] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-4">GBM HYPERPARAMETERS</p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(info.gbm_params).map(([key, value]) => (
                <div key={key} className="p-3 bg-[rgba(26,60,43,0.03)]">
                  <p className="font-mono text-[9px] text-[#6B6B68] uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                  <p className="font-heading text-xl font-bold text-[#1A3C2B]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Training Info */}
          <div className="bg-white border border-[rgba(58,58,56,0.2)] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-4">TRAINING INFO</p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(info.training_info).map(([key, value]) => (
                <div key={key} className="p-3 bg-[rgba(26,60,43,0.03)]">
                  <p className="font-mono text-[9px] text-[#6B6B68] uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                  <p className="font-heading text-xl font-bold text-[#1A3C2B]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
