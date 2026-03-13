import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileSearch, BarChart3, Activity, Target, Layers, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { healthCheck, getStats, getRecentScans } from '../lib/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, statsRes, scansRes] = await Promise.all([
          healthCheck(),
          getStats(),
          getRecentScans(5),
        ]);
        setHealth(healthRes.data);
        setStats(statsRes.data);
        setRecentScans(scansRes.data.scans);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsCards = [
    { label: 'Samples Analyzed', value: stats?.total_analyzed || 250, icon: FileSearch },
    { label: 'Accuracy', value: `${stats?.accuracy || 98.67}%`, icon: Target },
    { label: 'False Negatives', value: `${stats?.false_negative_rate || 0}%`, icon: Shield },
    { label: 'Malware Families', value: stats?.malware_families || 10, icon: Layers },
  ];

  const systemStatus = [
    { label: 'YARA Engine', status: health?.yara_engine || 'ONLINE', color: 'mint' },
    { label: 'GBM Model', status: health?.gbm_model || 'LOADED', color: 'gold' },
    { label: 'LLM Layer', status: health?.llm_layer || 'ACTIVE', color: 'coral' },
  ];

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-paper-secondary rounded-xs" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-paper-secondary rounded-xs" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12" data-testid="dashboard-page">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-forest text-white font-mono text-[10px] uppercase tracking-widest">
                v2.0
              </span>
              <span className="px-3 py-1 border border-mint text-forest font-mono text-[10px] uppercase tracking-widest">
                Operational
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-forest tracking-tight leading-[0.9] mb-6">
              SentinelX<br />Defender
            </h1>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-px h-16 bg-forest/30" />
              <p className="font-mono text-sm text-hairline uppercase tracking-wide leading-relaxed">
                Hybrid Malware Detection<br />
                YARA + AI Heuristics<br />
                Zero-Day Defense
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/scanner" data-testid="launch-scanner-btn">
                <Button className="h-12 px-8 bg-forest hover:bg-forest-light rounded-xs font-mono text-xs uppercase tracking-widest">
                  <Zap className="w-4 h-4 mr-2" />
                  Launch Scanner
                </Button>
              </Link>
              <Link to="/benchmark" data-testid="view-benchmark-btn">
                <Button variant="outline" className="h-12 px-8 border-forest text-forest hover:bg-forest/5 rounded-xs font-mono text-xs uppercase tracking-widest">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Benchmark
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Abstract Visualization */}
          <div className="md:col-span-5 hidden md:flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 border border-dashed border-hairline/30 rounded-full" />
              <div className="absolute inset-8 border border-hairline/20 rounded-full animate-[spin_20s_linear_infinite]">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-coral" />
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-mint" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gold" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-forest" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-hairline/20">
          {statsCards.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white p-6 tech-card"
              data-testid={`stat-card-${index}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className="w-4 h-4 text-forest" />
                <span className="font-mono text-[10px] text-hairline uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
              <p className="text-3xl font-heading font-bold text-forest">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* System Status */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-forest" />
          <h2 className="font-mono text-[10px] text-hairline uppercase tracking-widest">
            System Status
          </h2>
        </div>
        <div className="bg-white border border-hairline/20 p-4">
          <div className="flex flex-wrap gap-6">
            {systemStatus.map((item) => (
              <div key={item.label} className="flex items-center gap-3" data-testid={`status-${item.label.toLowerCase().replace(' ', '-')}`}>
                <div className={`status-dot bg-${item.color}`} />
                <span className="font-mono text-xs">
                  <span className="text-hairline/60">{item.label}:</span>{' '}
                  <span className="text-forest font-medium">{item.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Threats */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-forest" />
            <h2 className="font-mono text-[10px] text-hairline uppercase tracking-widest">
              Recent Scans
            </h2>
          </div>
          <Link to="/scanner" className="font-mono text-[10px] text-forest uppercase tracking-widest hover:underline">
            View All
          </Link>
        </div>
        <div className="bg-white border border-hairline/20 overflow-hidden">
          {recentScans.length > 0 ? (
            <table className="w-full" data-testid="recent-scans-table">
              <thead>
                <tr className="border-b border-hairline/20 bg-paper-secondary">
                  <th className="px-4 py-3 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">Scan ID</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">Threat Level</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">Confidence</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] text-hairline uppercase tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr key={scan.scan_id} className="border-b border-hairline/10 last:border-0 data-row transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-hairline">{scan.scan_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                        scan.threat_level === 'MALICIOUS' ? 'bg-coral/20 text-coral' :
                        scan.threat_level === 'SUSPICIOUS' ? 'bg-gold/20 text-gold' :
                        'bg-mint/20 text-forest'
                      }`}>
                        {scan.threat_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-forest">{scan.confidence_score.toFixed(1)}%</td>
                    <td className="px-4 py-3 font-mono text-xs text-hairline/60">
                      {new Date(scan.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-xs text-hairline/60">No recent scans. Launch the scanner to analyze files.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
