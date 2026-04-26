import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaCode, FaProjectDiagram, FaBrain, FaCog, FaCalendarAlt, FaList, FaStar } from 'react-icons/fa';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const sidebar = useRef<any>(null);

  // Close on Escape
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  const menuItems = [
    { name: 'Tableau de Bord', icon: <FaHome />, path: '/dashboard' },
    { name: 'Projets', icon: <FaProjectDiagram />, path: '/project' },
    { name: 'Collaborateurs', icon: <FaUsers />, path: '/person' },
    { name: 'Compétences', icon: <FaCode />, path: '/skill' },
    { name: 'Compétences Personnel', icon: <FaStar />, path: '/person-skills' },
    { name: 'Listes Unifiées', icon: <FaList />, path: '/lists' },

    { name: 'Calendrier', icon: <FaCalendarAlt />, path: '/calendar' },
    { name: 'Paramètres', icon: <FaCog />, path: '/settings' },
  ];

  const handleItemClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <aside
        ref={sidebar}
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-y-hidden bg-white/80 backdrop-blur-xl border-r border-white/50 font-inter shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 sidebar ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section - Align with Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100 h-[73px]">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <FaBrain className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TalentIA</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6">
          <nav className="px-4">
            <ul className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={handleItemClick}
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300 hover-lift ${
                      pathname.includes(item.path)
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`text-lg ${
                      pathname.includes(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>{item.icon}</span>
                    <span className="text-sm tracking-wide">{item.name}</span>
                    {pathname.includes(item.path) && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBrain className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Besoin d'aide ?</p>
                <p className="text-xs text-gray-600">Consultez notre documentation</p>
              </div>
            </div>
            <button className="w-full bg-white text-blue-600 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors mt-2">
              En savoir plus
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}
    </>
  );
};

export default Sidebar;
