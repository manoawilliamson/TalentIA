import React, { useState, useEffect } from 'react';
import {
  FaProjectDiagram, FaCode, FaUsers, FaChartLine,
  FaClock, FaStar, FaTrophy, FaExclamationTriangle,
  FaCheckCircle, FaChartBar, FaChartPie
} from 'react-icons/fa';
import BASE_URL from '../../services/api';

// ─── Types ─────────────────────────────────────────────────────────────────────

// ─── Mini SVG Bar Chart ─────────────────────────────────────────────────────────
const BarChart = ({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-xs text-gray-500 font-medium">{d.value}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-700"
            style={{ height: `${(d.value / max) * 96}px`, background: colors[i % colors.length] }}
          />
          <span className="text-xs text-gray-500 text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Mini SVG Donut Chart ───────────────────────────────────────────────────────
const DonutChart = ({ segments, total }: { segments: { label: string; value: number; color: string }[]; total: number }) => {
  const radius = 45;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f3f4f6" strokeWidth="12" />
        {segments.map((seg, i) => {
          const dash = total > 0 ? (seg.value / total) * circumference : 0;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dasharray 0.8s ease' }}
            />
          );
          offset += dash;
          return el;
        })}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1f2937">{total}</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span>{seg.label}: <strong>{seg.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Skills Gap Progress Bar ────────────────────────────────────────────────────
const GapBar = ({ skill, required, current }: { skill: string; required: number; current: number }) => {
  const pct = required > 0 ? Math.min((current / required) * 100, 100) : 0;
  const gap = required - current;
  const isOk = gap <= 0;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{skill}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{current}/{required}</span>
          {isOk
            ? <FaCheckCircle className="text-green-500 text-xs" />
            : <span className="text-xs font-semibold text-red-500 flex items-center gap-1"><FaExclamationTriangle className="text-xs" />-{gap}</span>
          }
        </div>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isOk ? 'linear-gradient(90deg,#10b981,#059669)' : pct > 60 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#ef4444,#dc2626)'
          }}
        />
      </div>
    </div>
  );
};

// ─── Line Sparkline ─────────────────────────────────────────────────────────────
const Sparkline = ({ data, color = '#3b82f6' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data, 1);
  const w = 200, h = 60;
  const len = data.length;
  const pts = data.map((v, i) => {
    const x = len > 1 ? (i / (len - 1)) * w : 0;
    const y = h - (v / max) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#grad-${color})`} fillOpacity="0.1" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={len > 1 ? (i / (len - 1)) * w : 0} cy={h - (v / max) * (h - 8) - 4} r="3" fill={color} />
      ))}
    </svg>
  );
};

// ─── Main Dashboard Component ───────────────────────────────────────────────────
const ECommerce: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeKpi, setActiveKpi] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/dashboard/statistics`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des analyses en temps réel...</p>
        </div>
      </div>
    );
  }

  const { counters, segments, top_skills, gaps, activity, participation, evolution } = stats;

  const kpis = [
    {
      label: 'Projets', value: counters.projects, sub: counters.projects > 0 ? `Données réelles` : 'Aucun projet',
      icon: FaProjectDiagram, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/25',
      trend: '+0%', trendUp: true, evolution: evolution.projects, color: '#3b82f6'
    },
    {
      label: 'Compétences', value: counters.skills, sub: counters.skills > 0 ? `Données réelles` : 'Aucune compétence',
      icon: FaCode, gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/25',
      trend: '+0%', trendUp: true, evolution: evolution.skills, color: '#8b5cf6'
    },
    {
      label: 'Collaborateurs', value: counters.persons, sub: counters.persons > 0 ? `Effectif total` : 'Aucun collaborateur',
      icon: FaUsers, gradient: 'from-green-500 to-green-600', shadow: 'shadow-green-500/25',
      trend: '+0%', trendUp: true, evolution: evolution.persons, color: '#10b981'
    },
    {
      label: 'Performance', value: `${counters.performance}%`, sub: 'Moyenne globale',
      icon: FaChartLine, gradient: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/25',
      trend: '+0%', trendUp: true, evolution: [0, 0, 0, 0, 0, counters.performance], color: '#6366f1'
    },
  ];

  const skillsEvolutionChartData = [
    { label: 'T-5', value: evolution.skills[0] },
    { label: 'T-4', value: evolution.skills[1] },
    { label: 'T-3', value: evolution.skills[2] },
    { label: 'T-2', value: evolution.skills[3] },
    { label: 'T-1', value: evolution.skills[4] },
    { label: 'Actuel', value: evolution.skills[5] },
  ];

  const donutTotal = segments.reduce((s: number, d: any) => s + d.value, 0);

  const teamBarData = participation && participation.length > 0 
    ? participation.map((p: any) => ({ label: p.name || '?', value: p.project_count }))
    : [{ label: 'Aucune donnée', value: 0 }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="fixed top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">Tableau de Bord</h1>
            <p className="text-gray-500 flex items-center gap-2 text-sm">
              <FaClock className="text-gray-400" />
              Dernière synchronisation : {new Date().toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            const isActive = activeKpi === i;
            return (
              <div
                key={i}
                className={`bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${isActive ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => setActiveKpi(isActive ? null : i)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${kpi.gradient} rounded-xl flex items-center justify-center shadow-lg ${kpi.shadow}`}>
                    <Icon className="text-white text-xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                <p className="text-gray-600 text-sm mb-3">{kpi.label}</p>
                <div className="border-t border-gray-100 pt-3">
                  <Sparkline data={kpi.evolution} color={kpi.color} />
                  <p className="text-xs text-gray-500 mt-1">{kpi.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-purple-600 text-sm" />
              </div>
              Évolution des Compétences
            </h2>
            <BarChart
              data={skillsEvolutionChartData}
              colors={['#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6']}
            />
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaChartPie className="text-blue-600 text-sm" />
              </div>
              Statut des Projets
            </h2>
            <DonutChart segments={segments} total={donutTotal} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-red-500 text-sm" />
            </div>
            Visualisation des Écarts de Compétences
          </h2>
          <div className="space-y-1">
            {gaps && gaps.length > 0 ? (
              gaps.map((g: any, i: number) => (
                <GapBar key={i} skill={g.skill_name} required={Number(g.required_level)} current={0} />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">Aucun écart critique détecté (données réelles uniquement)</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaTrophy className="text-yellow-600 text-sm" />
              </div>
              Top Compétences
            </h2>
            <div className="space-y-3">
              {top_skills && top_skills.length > 0 ? (
                top_skills.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-blue-600 text-white flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700 font-medium truncate">{s.name}</span>
                        <span className="text-xs text-gray-500 ml-1">{s.count} pers.</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">Pas encore de statistiques</p>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-green-600 text-sm" />
              </div>
              Participation aux Projets
            </h2>
            <BarChart
              data={teamBarData}
              colors={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']}
            />
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-indigo-600 text-sm" />
              </div>
              Activité Récente
            </h2>
            <div className="space-y-3">
              {activity && activity.length > 0 ? (
                activity.map((a: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${a.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{a.title}</p>
                      <p className="text-gray-500 text-xs">{a.desc}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">En attente...</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaStar className="text-blue-600 text-sm" />
            </div>
            Performances
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Collaborateur</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Projets</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {participation && participation.length > 0 ? (
                  participation.map((p: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{p.name} {p.firstname}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">{p.project_count || 0}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                           <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.avg_score}%` }} />
                          </div>
                          <span className="font-bold">{p.avg_score || 0}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="py-8 text-center text-gray-400">Aucune donnée</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
