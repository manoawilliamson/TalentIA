import { useState, useEffect } from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaUsers, FaProjectDiagram, FaCode, FaArrowUp, FaDownload, FaCalendarAlt } from 'react-icons/fa';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytiques</h1>
            <p className="text-gray-600">Vue d'ensemble des performances et tendances</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2">
              <FaDownload className="text-sm" />
              Exporter
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FaChartLine className="text-white text-lg" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <FaArrowUp className="text-xs" />
                +15%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">89%</h3>
            <p className="text-gray-600 text-sm">Taux de complétion</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <FaProjectDiagram className="text-white text-lg" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <FaChartLine className="text-xs" />
                +8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">142</h3>
            <p className="text-gray-600 text-sm">Projets terminés</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <FaUsers className="text-white text-lg" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <FaChartLine className="text-xs" />
                +12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">94%</h3>
            <p className="text-gray-600 text-sm">Satisfaction équipe</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
                <FaCode className="text-white text-lg" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <FaChartLine className="text-xs" />
                +23%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">3.2k</h3>
            <p className="text-gray-600 text-sm">Compétences développées</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Performance Chart */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-blue-600 text-sm" />
              </div>
              Performance des Projets
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir détails
            </button>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100">
            <div className="text-center">
              <FaChartBar className="text-4xl text-blue-400 mb-3 mx-auto" />
              <p className="text-gray-600">Graphique de performance</p>
              <p className="text-sm text-gray-500">Visualisation des tendances</p>
            </div>
          </div>
        </div>

        {/* Skills Distribution */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaChartPie className="text-purple-600 text-sm" />
              </div>
              Distribution des Compétences
            </h2>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Voir détails
            </button>
          </div>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center border border-purple-100">
            <div className="text-center">
              <FaChartPie className="text-4xl text-purple-400 mb-3 mx-auto" />
              <p className="text-gray-600">Répartition des compétences</p>
              <p className="text-sm text-gray-500">Par catégorie et niveau</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-green-600 text-sm" />
            </div>
            Activité Récente
          </h2>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {[
            { title: "Nouveau projet lancé", desc: "Application Mobile - Phase 1", time: "Il y a 2h", type: "success" },
            { title: "Compétence validée", desc: "React.js - Niveau Avancé", time: "Il y a 4h", type: "info" },
            { title: "Milestone atteint", desc: "Site E-commerce - 80% complété", time: "Il y a 6h", type: "warning" },
            { title: "Nouveau membre", desc: "Alice Martin rejoint l'équipe", time: "Il y a 8h", type: "success" },
            { title: "Formation terminée", desc: "Certification AWS - 5 membres", time: "Il y a 1 jour", type: "info" },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.desc}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
