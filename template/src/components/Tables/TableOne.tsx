import { useEffect, useState } from 'react';
import { FaTrophy, FaProjectDiagram, FaUsers } from 'react-icons/fa';

const TableOne = () => {
  const [techs, setTechs] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/person/stat')
      .then(res => res.json())
      .then(res => setTechs(res.data || []));
  }, []);

  return (
    <div className="dark-card rounded-2xl p-6 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-2xl font-bold text-white">
          Top Collaborateurs
        </h4>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <FaTrophy className="text-white" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 p-4 bg-gray-700/50 rounded-xl mb-2">
            <div className="text-left">
              <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Utilisateur
              </h5>
            </div>
            <div className="text-center sm:text-left"></div>
            <div className="text-center">
              <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Projets
              </h5>
            </div>
            <div className="hidden sm:block text-center"></div>
            <div className="hidden sm:block text-center">
              <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Participation
              </h5>
            </div>
          </div>

          {/* Table Body */}
          <div className="space-y-2">
            {techs.map((tech, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 group cursor-pointer transform hover:scale-[1.01] ${key === techs.length - 1 ? '' : ''
                  }`}
                key={key}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {tech.person_name ? tech.person_name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <p className="text-white font-medium truncate">
                    {tech.person_name}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <FaProjectDiagram className="text-blue-400 text-xs" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-white font-semibold text-lg">
                    {tech.project_count}
                  </p>
                </div>
                <div className="hidden sm:flex items-center justify-center">
                  <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(Number(tech.participation_percentage) || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center">
                  <p className="text-white font-medium">
                    {Number(tech.participation_percentage) ? Number(tech.participation_percentage).toFixed(2) : '0.00'}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          {techs.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-400">Aucun collaborateur trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableOne;