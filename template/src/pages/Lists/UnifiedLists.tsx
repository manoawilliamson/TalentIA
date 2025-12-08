import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaUsers, FaCode, FaSearch, FaFilter, FaTimes, FaEye, FaEdit, FaTrash, FaEnvelope, FaPhone } from 'react-icons/fa';
import { getProjects, deleteProject } from '../../services/projects.service';
import { getSkills, deleteSkill } from '../../services/Skills.service';
import { getPersons, deletePerson } from '../../services/Person.service';
import { useNavigate } from 'react-router-dom';

type ListType = 'projects' | 'persons' | 'skills';

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

const UnifiedLists: React.FC = () => {
  const [activeList, setActiveList] = useState<ListType>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
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
          console.log('Projects response:', projectResponse);
          setProjects(projectResponse.projects || []);
          break;
        case 'persons':
          const personResponse = await getPersons();
          console.log('Persons response:', personResponse);
          setPersons(personResponse || []);
          break;
        case 'skills':
          const skillResponse = await getSkills();
          console.log('Skills response:', skillResponse);
          setSkills(Array.isArray(skillResponse) ? skillResponse : []);
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

  // Handle item selection for details
  const handleItemClick = (item: any) => {
    // Show details panel for all types (projects, persons, skills)
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
        navigate('/project', { state: { toUpdateData: item, isUpdate: true } });
        break;
      case 'persons':
        navigate('/person', { state: { toUpdateData: item, isUpdate: true } });
        break;
      case 'skills':
        navigate('/skill', { state: { toUpdateData: item, isUpdate: true } });
        break;
    }
  };

  // List type configuration
  const listConfig = {
    projects: {
      title: 'Projects',
      icon: FaProjectDiagram,
      color: 'blue',
      columns: ['ID', 'Name', 'Description', 'Start Date', 'Actions'],
      data: filteredProjects
    },
    persons: {
      title: 'Collaborators',
      icon: FaUsers,
      color: 'green',
      columns: ['ID', 'Name', 'Email', 'Phone', 'Actions'],
      data: filteredPersons
    },
    skills: {
      title: 'Skills',
      icon: FaCode,
      color: 'purple',
      columns: ['ID', 'Name', 'Category', 'Actions'],
      data: filteredSkills
    }
  };

  const currentConfig = listConfig[activeList];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Unified Lists</h1>
          <p className="text-gray-400">Manage all your projects, collaborators, and skills in one place</p>
        </div>

        {/* List Type Selector */}
        <div className="flex gap-4 mb-6">
          {Object.entries(listConfig).map(([key, config]) => {
            const IconComponent = config.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveList(key as ListType)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeList === key
                    ? `bg-${config.color}-600 text-white shadow-lg`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${currentConfig.title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="standard-input pl-12"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-all duration-300">
            <FaFilter />
            <span>Filter</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Table */}
          <div className="lg:col-span-2">
            <div className="border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <currentConfig.icon className={`text-${currentConfig.color}-400`} />
                  {currentConfig.title}
                  <span className="text-sm text-gray-400">({currentConfig.data.length} items)</span>
                </h2>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : currentConfig.data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <currentConfig.icon className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-400">No {currentConfig.title.toLowerCase()} found</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        {currentConfig.columns.map((column, index) => (
                          <th key={index} className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {currentConfig.data.map((item: any, index) => (
                        <tr
                          key={item.id || index}
                          className="hover:bg-gray-700/50 cursor-pointer transition-colors"
                          onClick={() => handleItemClick(item)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white font-medium">#{item.id}</span>
                          </td>
                          {activeList === 'projects' && (
                            <>
                              <td className="px-6 py-4">
                                <div className="text-white font-medium">{item.name}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-300 text-sm max-w-xs truncate">{item.description}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-300 text-sm">{item.datebegin}</div>
                              </td>
                            </>
                          )}
                          {activeList === 'persons' && (
                            <>
                              <td className="px-6 py-4">
                                <div className="text-white font-medium">{item.name} {item.firstname}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-300 text-sm flex items-center gap-2">
                                  <FaEnvelope className="text-xs" />
                                  {item.email}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-300 text-sm flex items-center gap-2">
                                  <FaPhone className="text-xs" />
                                  {item.telephone}
                                </div>
                              </td>
                            </>
                          )}
                          {activeList === 'skills' && (
                            <>
                              <td className="px-6 py-4">
                                <div className="text-white font-medium">{item.name}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-300 text-sm max-w-xs truncate">{item.category}</div>
                              </td>
                            </>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(item, activeList);
                                }}
                                className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id, activeList);
                                }}
                                className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
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
              <div className="border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="p-6">
                  {activeList === 'projects' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium">{selectedItem.name}</h4>
                        <p className="text-gray-300 text-sm mt-1">{selectedItem.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Start Date:</span>
                          <p className="text-white">{selectedItem.datebegin}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">End Date:</span>
                          <p className="text-white">{selectedItem.dateend}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Team Size:</span>
                          <p className="text-white">{selectedItem.nbrperson} people</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <p className="text-white">{selectedItem.etat || 'Active'}</p>
                        </div>
                      </div>
                      {selectedItem.remark && (
                        <div>
                          <span className="text-gray-400">Remarks:</span>
                          <p className="text-white text-sm mt-1">{selectedItem.remark}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeList === 'persons' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium">{selectedItem.name} {selectedItem.firstname}</h4>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <p className="text-white">{selectedItem.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Phone:</span>
                          <p className="text-white">{selectedItem.telephone}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Address:</span>
                          <p className="text-white">{selectedItem.address}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Birthday:</span>
                          <p className="text-white">{selectedItem.birthday}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeList === 'skills' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium">{selectedItem.name}</h4>
                        <p className="text-gray-300 text-sm mt-1">{selectedItem.category}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border border-gray-700 rounded-2xl shadow-xl p-6 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEye className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-400">Click on an item to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLists;
