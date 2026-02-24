import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Applicant } from '@/types';
import { Users, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [stateData, setStateData] = useState<any[]>([]);
  const [positionData, setPositionData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: applicants, error } = await supabase
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !applicants) {
      setLoading(false);
      return;
    }

    // Calculate stats
    const statsData: Stats = {
      total: applicants.length,
      pending: applicants.filter((a: Applicant) => a.status === 'Pending').length,
      approved: applicants.filter((a: Applicant) => a.status === 'Approved').length,
      rejected: applicants.filter((a: Applicant) => a.status === 'Rejected').length,
    };
    setStats(statsData);

    // State-wise distribution
    const stateMap = new Map<string, number>();
    applicants.forEach((a: Applicant) => {
      stateMap.set(a.state, (stateMap.get(a.state) || 0) + 1);
    });
    const stateChartData = Array.from(stateMap.entries()).map(([name, value]) => ({ name, value }));
    setStateData(stateChartData);

    // Position-wise distribution
    const positionMap = new Map<string, number>();
    applicants.forEach((a: Applicant) => {
      positionMap.set(a.position, (positionMap.get(a.position) || 0) + 1);
    });
    const positionChartData = Array.from(positionMap.entries()).map(([name, value]) => ({ name, value }));
    setPositionData(positionChartData);

    // Monthly trends (last 6 months)
    const monthlyMap = new Map<string, number>();
    applicants.forEach((a: Applicant) => {
      const month = new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
    });
    const monthlyChartData = Array.from(monthlyMap.entries())
      .map(([month, applications]) => ({ month, applications }))
      .reverse()
      .slice(0, 6)
      .reverse();
    setMonthlyData(monthlyChartData);

    setLoading(false);
  };

  const COLORS = ['#FF6B35', '#0B1E2D', '#138808', '#FFA500', '#FF69B4', '#4169E1'];

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Analytics and insights for recruitment applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} />
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.total}</p>
          <p className="text-blue-100">Total Applications</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock size={32} />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.pending}</p>
          <p className="text-yellow-100">Pending Review</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.approved}</p>
          <p className="text-green-100">Approved</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <XCircle size={32} />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.rejected}</p>
          <p className="text-red-100">Rejected</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* State Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-navy mb-6">Applications by State</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF6B35" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Position Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-navy mb-6">Applications by Position</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={positionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {positionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-navy mb-6">Application Trends (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="applications" stroke="#138808" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
