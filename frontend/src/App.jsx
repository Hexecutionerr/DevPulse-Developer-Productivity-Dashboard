import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import Navbar from './components/Navbar';
import MetricCard from './components/MetricCard';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, historyRes] = await Promise.all([
          fetch('http://localhost:5000/api/metrics'),
          fetch('http://localhost:5000/api/history')
        ]);
        
        const metricsData = await metricsRes.json();
        const historyData = await historyRes.json();
        
        setData(metricsData);
        setHistory(historyData);
      } catch (err) {
        toast.error("Failed to sync with backend core.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatus = (title, value) => {
    if (!value) return 'Good';
    const num = parseFloat(value);
    switch (title) {
      case 'Lead Time': return num > 7 ? 'Bad' : num > 5 ? 'Warning' : 'Good';
      case 'Bug Rate': return num > 2 ? 'Bad' : num > 1 ? 'Warning' : 'Good';
      case 'Deployment': return num < 5 ? 'Bad' : num < 10 ? 'Warning' : 'Good';
      case 'PR Velocity': return num < 10 ? 'Bad' : num < 15 ? 'Warning' : 'Good';
      default: return 'Good';
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto px-6 py-12 animate-in fade-in duration-700">
      <header className="mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border border-blue-100">
              DevPulse Analytics v4.2
            </span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Productivity <span className="text-blue-600">Dynamics</span>.
          </h2>
        </div>
        <button 
          onClick={() => toast.success("Exporting report as PDF...")}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          Export Report
        </button>
      </header>

      {/* Metrics Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <MetricCard title="Lead Time" value={data.metrics.leadTime} status={getStatus('Lead Time', data.metrics.leadTime)} />
          <MetricCard title="Cycle Time" value={data.metrics.cycleTime} status={getStatus('Cycle Time', data.metrics.cycleTime)} />
          <MetricCard title="Bug Rate" value={data.metrics.bugRate} status={getStatus('Bug Rate', data.metrics.bugRate)} />
          <MetricCard title="Deployment" value={data.metrics.deploymentFrequency} status={getStatus('Deployment', data.metrics.deploymentFrequency)} />
          <MetricCard title="PR Velocity" value={data.metrics.prThroughput} status={getStatus('PR Velocity', data.metrics.prThroughput)} />
        </div>
      </section>

      {/* Charts Section */}
      <section className="mb-16 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            Efficiency Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorLT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="leadTime" stroke="#2563eb" fillOpacity={1} fill="url(#colorLT)" strokeWidth={3} />
                <Area type="monotone" dataKey="cycleTime" stroke="#818cf8" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0F172A] p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4">Action Strategy</h3>
            <p className="text-blue-100/60 leading-relaxed font-medium mb-10">
              {data.suggestion}
            </p>
            <button 
              onClick={() => {
                toast.promise(
                  new Promise((resolve) => setTimeout(resolve, 2000)),
                  {
                    loading: 'Deploying optimization scripts...',
                    success: 'Strategy deployed successfully!',
                    error: 'Deployment failed.',
                  }
                );
              }}
              className="w-full bg-blue-600 p-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-900/40"
            >
              Deploy Optimization
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Insight Section */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-gray-900">Intelligence Brief</h3>
        </div>
        <p className="text-gray-700 leading-[1.6] text-2xl font-bold italic border-l-4 border-amber-400 pl-6 bg-amber-50/30 rounded-r-2xl py-4">
          "{data.insight}"
        </p>
      </section>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Syncing Neural Core...</p>
    </div>
  </div>
);

const TeamPage = () => {
  const [devs, setDevs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/developers')
      .then(res => res.json())
      .then(data => { setDevs(data); setLoading(false); })
      .catch(() => { toast.error("Error loading team"); setLoading(false); });
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto px-6 py-12 animate-in slide-in-from-bottom duration-700">
      <h2 className="text-4xl font-black text-gray-900 mb-12">Team Intelligence</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {devs.map((dev, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.developer_name}`} alt="Dev" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{dev.developer_name}</h3>
            <p className="text-blue-600 text-sm font-bold">{dev.team_name}</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase">Level: {dev.level || 'Senior'}</span>
              <span className="text-[10px] font-black text-emerald-600 uppercase">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReportsPage = () => {
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/all-prs')
      .then(res => res.json())
      .then(data => { setPrs(data); setLoading(false); })
      .catch(() => { toast.error("Error loading reports"); setLoading(false); });
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto px-6 py-12 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-gray-900 mb-12">Data Exports: PR Logs</h2>
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">PR ID</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Developer</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lines</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rounds</th>
            </tr>
          </thead>
          <tbody>
            {prs.slice(0, 15).map((pr, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-6 font-bold text-gray-900">{pr.pr_id}</td>
                <td className="p-6 text-gray-600 font-medium">{pr.developer_name}</td>
                <td className="p-6 text-blue-600 font-black">{pr.lines_changed}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    pr.status === 'Merged' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {pr.status}
                  </span>
                </td>
                <td className="p-6 text-gray-400 font-bold">{pr.review_rounds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div className="container mx-auto px-6 py-32 text-center animate-in zoom-in duration-500">
    <h2 className="text-5xl font-black text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-400 text-xl font-medium max-w-md mx-auto">
      This module is currently initializing. Full dataset integration pending approval.
    </p>
    <button 
      onClick={() => window.history.back()}
      className="mt-12 text-blue-600 font-black uppercase tracking-widest text-sm hover:underline"
    >
      &larr; Return to Central Core
    </button>
  </div>
);

const App = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-blue-600 selection:text-white antialiased">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<PlaceholderPage title="System Config" />} />
      </Routes>
    </div>
  );
};

export default App;
