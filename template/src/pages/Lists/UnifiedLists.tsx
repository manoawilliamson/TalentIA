import { useState, useEffect } from 'react';
import { FaProjectDiagram, FaUsers, FaCode, FaSearch, FaFilter, FaTimes, FaEye, FaEdit, FaTrash, FaEnvelope, FaPhone, FaCheckCircle, FaExclamationCircle, FaPlay, FaCheck, FaSync } from 'react-icons/fa';
import { getProjects, deleteProject } from '../../services/projects.service';
import { getSkills, deleteSkill } from '../../services/Skills.service';
import { getPersons, deletePerson } from '../../services/Person.service';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../services/api';

type ListType = 'projects' | 'persons' | 'skills' | 'availability' | 'management';

interface Project {
  id?: number;
  name: string;
  description?: string;
  datebegin?: string;
  dateend?: string;
  nbrperson?: number;
  remark?: string;
  file?: string;
  etat?: string;
}

interface Person {
  id?: number;
  name: string;
  firstname: string;
  birthday: string;
  address: string;
  email: string;
  telephone: string;
}

interface Skill {
  id?: number;
  name: string;
  category: string;
}

const UnifiedLists = () => {
  const [activeList, setActiveList] = useState<ListType>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [availability, setAvailability] = useState<any[]>([]);
  const [managementProjects, setManagementProjects] = useState<Project[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [personProjects, setPersonProjects] = useState<any[]>([]);
  const [loadingPersonProjects, setLoadingPersonProjects] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch data based on active list
  useEffect(() => {
    fetchData();
  }, [activeList]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeList) {
        case 'projects':
          const projectResponse = await getProjects();
          setProjects(projectResponse.projects || []);
          break;
        case 'persons':
          const personResponse = await getPersons();
          setPersons(personResponse || []);
          break;
        case 'skills':
          const skillResponse = await getSkills();
          setSkills(Array.isArray(skillResponse) ? skillResponse : []);
          break;
        case 'availability':
          const availResponse = await fetch(`${BASE_URL}/person/availability`);
          const availData = await availResponse.json();
          setAvailability(availData || []);
          break;
        case 'management':
          const manageResponse = await getProjects();
          setManagementProjects(manageResponse.projects || []);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeList}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailability = availability.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredManagement = managementProjects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle item selection for details
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  // Handle delete
  const handleDelete = async (id: number, type: ListType) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      switch (type) {
        case 'projects':
          await deleteProject(id);
          setProjects(projects.filter(p => p.id !== id));
          break;
        case 'persons':
          await deletePerson(id);
          setPersons(persons.filter(p => p.id !== id));
          break;
        case 'skills':
          await deleteSkill(id);
          setSkills(skills.filter(s => s.id !== id));
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Handle edit
  const handleEdit = (item: any, type: ListType) => {
    switch (type) {
      case 'projects':
      case 'management':
        navigate('/project', { state: { toUpdateData: item, isUpdate: true } });
        break;
      case 'persons':
      case 'availability':
        navigate('/person', { state: { toUpdateData: item, isUpdate: true } });
        break;
      case 'skills':
        navigate('/skill', { state: { toUpdateData: item, isUpdate: true } });
        break;
    }
  };

  const handleStartProject = async (id: number) => {
    if (!confirm('Voulez-vous commencer ce projet immédiatement ?')) return;
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/projects/${id}/start`, { method: 'PUT' });
      const data = await resp.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'Erreur lors du démarrage du projet');
      }
    } catch (error) {
      console.error('Error starting project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateProject = async (id: number) => {
    if (!confirm('Voulez-vous terminer ce projet immédiatement ?')) return;
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/projects/${id}/terminate`, { method: 'PUT' });
      const data = await resp.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'Erreur lors de la terminaison du projet');
      }
    } catch (error) {
      console.error('Error terminating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonProjectModal = async (person: any) => {
    setSelectedItem(person);
    setLoadingPersonProjects(true);
    setShowProjectModal(true);
    try {
      const resp = await fetch(`${BASE_URL}/person/${person.id}/projects`);
      const data = await resp.json();
      setPersonProjects(data || []);
    } catch (error) {
      console.error('Error fetching person projects:', error);
    } finally {
      setLoadingPersonProjects(false);
    }
  };

  // List type configuration
  const listConfig: Record<ListType, any> = {
    projects: {
      title: 'Projets',
      icon: FaProjectDiagram,
      color: 'blue',
      columns: ['ID', 'Nom', 'Description', 'Date de début', 'Actions'],
      data: filteredProjects
    },
    persons: {
      title: 'Collaborateurs',
      icon: FaUsers,
      color: 'green',
      columns: ['ID', 'Nom', 'Email', 'Téléphone', 'Actions'],
      data: filteredPersons
    },
    skills: {
      title: 'Compétences',
      icon: FaCode,
      color: 'purple',
      columns: ['ID', 'Nom', 'Catégorie', 'Actions'],
      data: filteredSkills
    },
    availability: {
      title: 'Disponibilité',
      icon: FaUsers,
      color: 'indigo',
      columns: ['ID', 'Nom', 'Projets Actifs', 'Statut', 'Actions'],
      data: filteredAvailability
    },
    management: {
      title: 'Gestion Projets',
      icon: FaProjectDiagram,
      color: 'orange',
      columns: ['ID', 'Nom', 'Statut', 'Planning', 'Actions Rapides'],
      data: filteredManagement
    }
  };

  const currentConfig = listConfig[activeList];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaFilter className="text-blue-600 text-sm" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Listes Unifiées</h1>
        </div>
        <p className="text-gray-600">Gérez tous vos projets, collaborateurs et compétences en un seul endroit</p>
      </div>

      {/* List Type Selector */}
      <div className="flex gap-4 mb-6">
        {Object.entries(listConfig).map(([key, config]) => {
          const IconComponent = config.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveList(key as ListType)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeList === key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="text-lg" />
              <span>{config.title}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Rechercher ${currentConfig.title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300">
          <FaFilter />
          <span>Filtrer</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List Table */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <currentConfig.icon className="text-blue-600" />
                {currentConfig.title}
                <span className="text-sm text-gray-600">({currentConfig.data.length} éléments)</span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : currentConfig.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <currentConfig.icon className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-600">Aucun {currentConfig.title.toLowerCase()} trouvé</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {currentConfig.columns.map((column: string, index: number) => (
                        <th key={index} className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentConfig.data.map((item: any, index: number) => (
                      <tr
                        key={item.id || index}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleItemClick(item)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900 font-medium">#{item.id}</span>
                        </td>
                        {activeList === 'projects' && (
                          <>
                            <td className="px-6 py-4">
                              <div className="text-gray-900 font-medium">{item.name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-600 text-sm max-w-xs truncate">{item.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-600 text-sm">{item.datebegin}</div>
                            </td>
                          </>
                        )}
                        {activeList === 'persons' && (
                          <>
                            <td className="px-6 py-4">
                              <div className="text-gray-900 font-medium">{item.name} {item.firstname}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-600 text-sm flex items-center gap-2">
                                <FaEnvelope className="text-xs" />
                                {item.email}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-600 text-sm flex items-center gap-2">
                                <FaPhone className="text-xs" />
                                {item.telephone}
                              </div>
                            </td>
                          </>
                        )}
                        {activeList === 'skills' && (
                          <>
                            <td className="px-6 py-4">
                              <div className="text-gray-900 font-medium">{item.name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-600 text-sm max-w-xs truncate">{item.category}</div>
                            </td>
                          </>
                        )}
                        {activeList === 'availability' && (
                          <>
                            <td className="px-6 py-4">
                              <div 
                                className="text-blue-600 font-medium hover:underline cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePersonProjectModal(item);
                                }}
                              >
                                {item.name} {item.firstname}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-900">{item.active_projects_count} actifs</div>
                            </td>
                            <td className="px-6 py-4">
                              {item.available ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                  <FaCheckCircle className="text-sm" />
                                  Disponible
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                  <FaExclamationCircle className="text-sm" />
                                  Indisponible
                                </span>
                              )}
                            </td>
                          </>
                        )}
                        {activeList === 'management' && (
                          <>
                            <td className="px-6 py-4">
                              <div className="text-gray-900 font-medium">{item.name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                item.etat === 'EN_COURS' ? 'bg-blue-100 text-blue-700' :
                                item.etat === 'PLANIFIÉ' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.etat || 'Actif'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-600 text-sm">
                                {item.datebegin} → {item.dateend}
                              </div>
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {activeList === 'management' && (
                              <>
                                {item.etat === 'PLANIFIÉ' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartProject(item.id);
                                    }}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                    title="Commencer maintenant"
                                  >
                                    <FaPlay />
                                    <span>LANCER</span>
                                  </button>
                                )}
                                {item.etat === 'EN_COURS' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTerminateProject(item.id);
                                    }}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                    title="Terminer maintenant"
                                  >
                                    <FaCheck />
                                    <span>TERMINER</span>
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item, activeList);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id, activeList);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {showDetails && selectedItem ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Détails</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6">
                {activeList === 'projects' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 font-medium text-lg">{selectedItem.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">{selectedItem.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date de début:</span>
                        <p className="text-gray-900 font-medium">{selectedItem.datebegin}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Date de fin:</span>
                        <p className="text-gray-900 font-medium">{selectedItem.dateend}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Taille d'équipe:</span>
                        <p className="text-gray-900 font-medium">{selectedItem.nbrperson} personnes</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Statut:</span>
                        <p className="text-gray-900 font-medium">{selectedItem.etat || 'Actif'}</p>
                      </div>
                    </div>
                    {selectedItem.remark && (
                      <div>
                        <span className="text-gray-500">Remarques:</span>
                        <p className="text-gray-900 text-sm mt-1">{selectedItem.remark}</p>
                      </div>
                    )}
                  </div>
                )}
                {activeList === 'persons' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 font-medium text-lg">{selectedItem.name} {selectedItem.firstname}</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="text-gray-900 font-medium">{selectedItem.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Téléphone:</span>
                        <p className="text-gray-900 font-medium">{selectedItem.telephone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Adresse:</span>
                        <p className="text-gray-900 font-medium">{selectedItem.address}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Date de naissance:</span>
                        <p className="text-gray-900 font-medium">{selectedItem.birthday}</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeList === 'skills' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 font-medium text-lg">{selectedItem.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">{selectedItem.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEye className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-600">Cliquez sur un élément pour voir les détails</p>
            </div>
          )}
        </div>
      </div>

      {/* Collaborator Projects Modal */}
      {showProjectModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedItem.name} {selectedItem.firstname}</h3>
                  <p className="text-blue-100 text-xs">Aperçu des projets assignés</p>
                </div>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingPersonProjects ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaSync className="text-blue-500 text-3xl animate-spin mb-4" />
                  <p className="text-gray-500 text-sm">Chargement des projets...</p>
                </div>
              ) : personProjects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FaProjectDiagram className="text-gray-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">Aucun projet assigné pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {personProjects.map((proj) => (
                    <div key={proj.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{proj.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          proj.etat === 'EN_COURS' ? 'bg-blue-100 text-blue-700' :
                          proj.etat === 'PLANIFIÉ' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {proj.etat}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Début:</span> {proj.datebegin}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Fin:</span> {proj.dateend}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedLists;
