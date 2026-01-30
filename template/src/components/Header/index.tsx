import { useNavigate } from 'react-router-dom';
import { FaBrain, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';

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
    <header className="sticky top-0 z-999 flex w-full bg-gray-900 shadow-sm border-b border-gray-800">
      <div className="flex flex-grow items-center justify-between px-6 py-3">
        {/* Left Section: Mobile Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <FaBars className="text-xl" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaBrain className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">TalentIA</h1>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
              <FaUser className="text-gray-400 text-xs" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-gray-100 font-medium leading-none">Utilisateur Admin</span>
              <span className="text-gray-500 text-xs mt-1">Administrateur</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
