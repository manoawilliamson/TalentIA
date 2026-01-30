import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaCode, FaProjectDiagram, FaList, FaStar, FaChevronRight } from 'react-icons/fa';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const sidebar = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

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
    { name: 'Listes', icon: <FaList />, path: '/lists' },
    { name: 'Collaborateurs', icon: <FaUsers />, path: '/person' },
    { name: 'Compétences Personnes', icon: <FaStar />, path: '/person-skills' },
    { name: 'Compétences', icon: <FaCode />, path: '/skill' },
    { name: 'Projets', icon: <FaProjectDiagram />, path: '/project' },
  ];

  const handleItemClick = () => {
    setSidebarOpen(false);
    setIsHovered(false);
  };

  return (
    <>
      {/* Hover Trigger Zone (Desktop) */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        className="fixed left-0 top-0 bottom-0 w-4 z-9999 hidden lg:block"
      />

      <aside
        ref={sidebar}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out font-inter ${(sidebarOpen || isHovered) ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear py-6">
          <nav className="px-4">
            <ul className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={handleItemClick}
                    className={`group relative flex items-center gap-3.5 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${pathname.includes(item.path)
                      ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm tracking-wide">{item.name}</span>
                    {pathname.includes(item.path) && (
                      <div className="absolute right-4 text-[10px]">
                        <FaChevronRight />
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
