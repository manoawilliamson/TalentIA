import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUsers, FaPlus, FaSearch, FaFilter, FaUserGraduate, FaBriefcase, FaAward, FaList } from "react-icons/fa";
import PersonCreation from "./PersonCreation";
import BASE_URL from "../../services/api";

const Person = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [reloadCreation, setReloadCreation] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState<any>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    
    // Get navigation state for editing
    const state = location.state as { toUpdateData?: any; isUpdate?: boolean } || {};
    const { toUpdateData, isUpdate } = state;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoadingStats(true);
                const response = await fetch(`${BASE_URL}/dashboard/statistics`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    useEffect(()=>{
        return () => {
            setReloadCreation(false);
        }
    }, [reloadCreation]);

    const personCount = stats?.counters?.persons ?? 0;
    const skillCount = stats?.counters?.skills ?? 0;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Collaborateurs</h1>
                        <p className="text-gray-600 text-sm sm:text-base">Gérez votre équipe et leurs compétences</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
                            />
                        </div>
                        <button 
                            onClick={() => navigate('/lists')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 whitespace-nowrap"
                        >
                            <FaList className="text-sm" />
                            <span className="hidden sm:inline">Voir liste membre</span>
                            <span className="sm:hidden">Liste</span>
                        </button>
                        <button className="p-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                            <FaFilter />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                                <FaUsers className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{isLoadingStats ? '...' : personCount}</h3>
                                <p className="text-gray-600 text-sm">Total Collaborateurs</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <FaBriefcase className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{isLoadingStats ? '...' : stats?.segments?.find((s: any) => s.label === 'Projets actifs')?.value || 0}</h3>
                                <p className="text-gray-600 text-sm">Impact Projets</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <FaUserGraduate className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{isLoadingStats ? '...' : stats?.evolution?.persons_total || 0}</h3>
                                <p className="text-gray-600 text-sm">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
                                <FaAward className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{isLoadingStats ? '...' : skillCount}</h3>
                                <p className="text-gray-600 text-sm">Compétences Gérées</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <FaPlus className="text-green-600 text-sm" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isUpdate ? "Modifier le Collaborateur" : "Nouveau Collaborateur"}
                    </h2>
                </div>
                {/* PersonCreation now handles its own internal card styling */}
                <PersonCreation 
                    reload={reloadCreation} 
                    toUpdateData={toUpdateData} 
                    isUpdate={isUpdate} 
                    reloadTrigger={() => setReloadCreation(true)} 
                />
            </div>
        </div>
    );
};

export default Person;