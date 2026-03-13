import React, { useState, useEffect } from 'react';
import { Database, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getDatasetInfo, getDatasetSamples } from '../lib/api';
import { toast } from 'sonner';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const Dataset = () => {
  const [info, setInfo] = useState(null);
  const [samples, setSamples] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await getDatasetInfo();
        setInfo(response.data);
      } catch (error) {
        toast.error('Failed to fetch dataset info');
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    const fetchSamples = async () => {
      setLoading(true);
      try {
        const response = await getDatasetSamples(page, 15, filter);
        setSamples(response.data.samples);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        toast.error('Failed to fetch samples');
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, [page, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  if (!info) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-16 bg-paper-secondary w-1/3" />
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-paper-secondary" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const distributionData = [
    { name: 'Malware', value: info.malware_count, color: '#FF8C69' },
    { name: 'Benign', value: info.benign_count, color: '#9EFFBF' },
  ];

  const familyData = Object.entries(info.family_distribution).map(([family, count]) => ({
    family: family.split('.').pop() || family,
    count,
  })).sort((a, b) => b.count - a.count);

  const statsCards = [
    { label: 'Total Samples', value: info.total_samples },
    { label: 'Malware', value: info.malware_count },
    { label: 'Benign', value: info.benign_count },
    { label: 'Families', value: info.malware_families.length },
    { label: 'Features', value: info.features.length },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12" data-testid="dataset-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-hairline uppercase tracking-widest">04.</span>
          <h1 className="text-3xl font-heading font-bold text-forest">Dataset Explorer</h1>
        </div>
        <p className="font-mono text-sm text-hairline/60">PE Feature Dataset · 250 Samples · 20 Features</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-[1px] bg-hairline/20 mb-8">
        {statsCards.map((stat) => (
          <div key={stat.label} className="bg-white p-4 text-center">
            <p className="text-2xl font-heading font-bold text-forest mb-1">{stat.value}</p>
            <p className="font-mono text-[10px] text-hairline uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Distribution Pie */}
        <div className="bg-white border border-hairline/20 p-6" data-testid="distribution-chart">
          <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest mb-6">Label Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #3A3A3820', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Family Distribution */}
        <div className="bg-white border border-hairline/20 p-6" data-testid="family-chart">
          <h3 className="font-mono text-[10px] text-hairline uppercase tracking-widest mb-6">Malware Family Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={familyData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3820" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} stroke="#3A3A38" />
              <YAxis type="category" dataKey="family" tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} stroke="#3A3A38" width={80} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #3A3A3820', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
              />
              <Bar dataKey="count" fill="#1A3C2B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sample Table */}
      <div className="bg-white border border-hairline/20" data-testid="samples-table">
        {/* Filter Bar */}
        <div className="flex items-center justify-between p-4 border-b border-hairline/20">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-hairline" />
            <span className="font-mono text-[10px] text-hairline uppercase tracking-widest">Filter:</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange(undefined)}
              className={`h-8 px-4 rounded-xs font-mono text-[10px] uppercase ${filter === undefined ? 'bg-forest' : 'border-hairline/20'}`}
              data-testid="filter-all"
            >
              All
            </Button>
            <Button
              variant={filter === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange(1)}
              className={`h-8 px-4 rounded-xs font-mono text-[10px] uppercase ${filter === 1 ? 'bg-coral text-white' : 'border-hairline/20'}`}
              data-testid="filter-malware"
            >
              Malware
            </Button>
            <Button
              variant={filter === 0 ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange(0)}
              className={`h-8 px-4 rounded-xs font-mono text-[10px] uppercase ${filter === 0 ? 'bg-mint text-forest' : 'border-hairline/20'}`}
              data-testid="filter-benign"
            >
              Benign
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline/20 bg-paper-secondary">
                <th className="px-4 py-3 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">SHA256</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">Family</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">Label</th>
                <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">Entropy</th>
                <th className="px-4 py-3 text-center font-mono text-[10px] text-hairline uppercase tracking-widest">Packed</th>
                <th className="px-4 py-3 text-center font-mono text-[10px] text-hairline uppercase tracking-widest">YARA Hit</th>
                <th className="px-4 py-3 text-right font-mono text-[10px] text-hairline uppercase tracking-widest">Threat Score</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(10).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-hairline/10">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="h-4 bg-paper-secondary animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                samples.map((sample) => (
                  <tr key={sample.sha256} className="border-b border-hairline/10 last:border-0 data-row">
                    <td className="px-4 py-3 font-mono text-xs text-hairline">{sample.sha256.slice(0, 16)}...</td>
                    <td className="px-4 py-3 font-mono text-xs text-forest">{sample.family.split('.').pop()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 font-mono text-[10px] uppercase ${sample.label === 1 ? 'bg-coral/10 text-coral' : 'bg-mint/10 text-forest'}`}>
                        {sample.label === 1 ? 'Malware' : 'Benign'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-hairline">{sample.entropy.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono text-xs ${sample.packed ? 'text-coral' : 'text-hairline/40'}`}>
                        {sample.packed ? '●' : '○'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono text-xs ${sample.yara_hit ? 'text-forest' : 'text-hairline/40'}`}>
                        {sample.yara_hit ? '●' : '○'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono text-xs ${sample.threat_score > 0.5 ? 'text-coral' : 'text-forest'}`}>
                        {sample.threat_score.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-hairline/20">
          <p className="font-mono text-[10px] text-hairline">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 px-3 rounded-xs border-hairline/20"
              data-testid="prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 px-3 rounded-xs border-hairline/20"
              data-testid="next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dataset;
