import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaBrain, FaTimes, FaHome, FaUsers, FaCode, FaProjectDiagram, FaCog, FaQuestionCircle, FaUser, FaList, FaStar } from 'react-icons/fa';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden glass-effect border-r border-gray-700 duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border-b border-gray-700">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <FaBrain className="text-white text-lg" />
          </div>
          <h1 className="text-xl font-bold gradient-text">TalentIA</h1>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center hover:bg-gray-700/70 transition-colors"
        >
          <FaTimes className="text-white" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </h3>

            <ul className="mb-6 flex flex-col gap-2">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700/50 hover:text-white transition-all ${(pathname === '/dashboard' || pathname.includes('dashboard')) &&
                    'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                    }`}
                >
                  <FaHome className="text-lg w-5" />
                  <span className="sidebar-expanded:block">Dashboard</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Lists --> */}
              <li>
                <NavLink
                  to="/lists"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700/50 hover:text-white transition-all ${pathname.includes('lists') &&
                    'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                    }`}
                >
                  <FaList className="text-lg w-5" />
                  <span className="sidebar-expanded:block">Lists</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Lists --> */}

              {/* <!-- Menu Item Person --> */}
              <li>
                <NavLink
                  to="/person"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700/50 hover:text-white transition-all ${pathname.includes('person') &&
                    'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                    }`}
                >
                  <FaUsers className="text-lg w-5" />
                  <span className="sidebar-expanded:block">Collaborateurs</span>
                </NavLink>
              </li>

              {/* <!-- Menu Item Person Skills --> */}
              <li>
                <NavLink
                  to="/person-skills"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700/50 hover:text-white transition-all ${pathname.includes('person-skills') &&
                    'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                    }`}
                >
                  <FaStar className="text-lg w-5" />
                  <span className="sidebar-expanded:block">Compétences Personnes</span>
                </NavLink>
              </li>

              {/* <!-- Menu Item Skills --> */}
              <li>
                <NavLink
                  to="/skill"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700/50 hover:text-white transition-all ${pathname.includes('skill') &&
                    'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                    }`}
                >
                  <FaCode className="text-lg w-5" />
                  <span className="sidebar-expanded:block">Compétences</span>
                </NavLink>
              </li>

              {/* <!-- Menu Item Projects --> */}
              <li>
                <NavLink
                  to="/project"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700/50 hover:text-white transition-all ${pathname.includes('project') &&
                    'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                    }`}
                >
                  <FaProjectDiagram className="text-lg w-5" />
                  <span className="sidebar-expanded:block">Projets</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Calendar --> */}

            </ul>
          </div>

          {/* Additional Menu Group */}

        </nav>
        {/* <!-- Sidebar Menu --> */}


      </div>
    </aside>
  );
};

export default Sidebar;
