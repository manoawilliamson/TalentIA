import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaBell, FaSearch, FaCog } from 'react-icons/fa';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("mock-token");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/50">
      <div className="flex flex-grow items-center justify-between px-6 py-4">
        {/* Left Section: Mobile Menu + Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2 lg:hidden"
          >
            <FaBars className="text-xl" />
          </button>

          <div className="hidden md:flex items-center gap-3 bg-gray-50/50 rounded-xl px-4 py-2.5 border border-gray-200">
            <FaSearch className="text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent text-gray-900 placeholder-gray-400 text-sm w-64 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Section: Notifications + User + Settings */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200">
            <FaBell className="text-lg" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200">
            <FaCog className="text-lg" />
          </button>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <FaUser className="text-white text-sm" />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-gray-900 font-semibold leading-none">Admin User</span>
                <span className="text-gray-500 text-xs mt-1">Administrateur</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Déconnexion"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
