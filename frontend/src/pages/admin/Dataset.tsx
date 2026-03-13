import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDatasetInfo, getDatasetSamples } from '../../services/api';
import { DatasetInfo, DatasetSample } from '../../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const Dataset: React.FC = () => {
  const [info, setInfo] = useState<DatasetInfo | null>(null);
  const [samples, setSamples] = useState<DatasetSample[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getDatasetInfo();
        setInfo(data);
      } catch (error) {
        setInfo({
          total_samples: 250,
          malware_count: 150,
          benign_count: 100,
          malware_families: [],
          features: [],
          family_distribution: {}
        });
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    const fetchSamples = async () => {
      setLoading(true);
      try {
        const data = await getDatasetSamples(page, 15);
        setSamples(data.samples);
        setTotalPages(data.total_pages);
      } catch (error) {
        setSamples([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, [page]);

  if (!info) {
    return (
      <div className="min-h-screen pt-14 mosaic-bg">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="space-y-4">
            <div className="h-12 w-64 skeleton" />
            <div className="h-40 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Malware', value: info.malware_count, color: '#FF8C69' },
    { name: 'Benign', value: info.benign_count, color: '#9EFFBF' },
  ];

  return (
    <div className="min-h-screen pt-14 mosaic-bg" data-testid="admin-dataset-page">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-[#1A3C2B] mb-2">DATASET</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">— PE FEATURE DATASET EXPLORER</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-[1px] bg-[rgba(58,58,56,0.2)] mb-8">
          <div className="bg-white p-6 text-center">
            <p className="font-heading text-4xl font-bold text-[#1A3C2B] mb-1">{info.total_samples}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">Total Samples</p>
          </div>
          <div className="bg-white p-6 text-center border-l-[3px] border-l-[#FF8C69]">
            <p className="font-heading text-4xl font-bold text-[#FF8C69] mb-1">{info.malware_count}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">Malware</p>
          </div>
          <div className="bg-white p-6 text-center border-l-[3px] border-l-[#9EFFBF]">
            <p className="font-heading text-4xl font-bold text-[#1A3C2B] mb-1">{info.benign_count}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68]">Benign</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-[rgba(58,58,56,0.2)] p-6 mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6B68] mb-4">LABEL DISTRIBUTION</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(58,58,56,0.2)', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Samples Table */}
        <div className="bg-white border border-[rgba(58,58,56,0.2)]">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SHA256</th>
                  <th>Family</th>
                  <th>Label</th>
                  <th>Entropy</th>
                  <th>Packed</th>
                  <th>YARA Hit</th>
                  <th>Threat Score</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7}><div className="h-4 skeleton" /></td>
                    </tr>
                  ))
                ) : (
                  samples.map((sample) => (
                    <tr key={sample.sha256}>
                      <td className="font-mono text-[10px] text-[#6B6B68]">{sample.sha256.slice(0, 16)}...</td>
                      <td className="font-mono text-xs">{sample.family.split('.').pop()}</td>
                      <td>
                        <span className={`px-2 py-0.5 font-mono text-[9px] uppercase ${sample.label === 1 ? 'bg-[rgba(255,140,105,0.1)] text-[#FF8C69]' : 'bg-[rgba(158,255,191,0.1)] text-[#1A3C2B]'}`}>
                          {sample.label === 1 ? 'Malware' : 'Benign'}
                        </span>
                      </td>
                      <td className="font-mono text-xs">{sample.entropy.toFixed(2)}</td>
                      <td className="font-mono text-xs">{sample.packed ? '●' : '○'}</td>
                      <td className="font-mono text-xs">{sample.yara_hit ? '●' : '○'}</td>
                      <td className="font-mono text-xs" style={{ color: sample.threat_score > 0.5 ? '#FF8C69' : '#1A3C2B' }}>{sample.threat_score.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[rgba(58,58,56,0.1)]">
            <p className="font-mono text-[10px] text-[#6B6B68]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-[rgba(58,58,56,0.2)] disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-[rgba(58,58,56,0.2)] disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dataset;
