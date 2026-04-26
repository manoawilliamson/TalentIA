import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaUser, FaStar, FaSearch } from 'react-icons/fa';
import BASE_URL from '../../services/api';
import { getSkills } from '../../services/Skills.service';
import { getPersonSkills, addPersonSkill, PersonSkill } from '../../services/PersonSkills.service';
import type { Skill } from '../../types/skill';

interface Person {
    id: number;
    name: string;
    firstname: string;
    email: string;
}

const PersonSkills = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [personSkills, setPersonSkills] = useState<PersonSkill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Add/Edit state
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        skillId: '',
        rating: 5
    });
    const [editingSkills, setEditingSkills] = useState<{ [key: number]: PersonSkill }>({});

    // Load all persons
    useEffect(() => {
        fetch(`${BASE_URL}/person`)
            .then(res => res.json())
            .then(data => setPersons(data || []))
            .catch(err => console.error('Error loading persons:', err));
    }, []);

    // Load available skills
    useEffect(() => {
        getSkills().then(data => {
            if (Array.isArray(data)) {
                setAvailableSkills(data);
            } else {
                setAvailableSkills([]);
            }
        });
    }, []);

    // Load person skills when person is selected
    useEffect(() => {
        if (selectedPerson) {
            setLoading(true);
            getPersonSkills(selectedPerson.id)
                .then(skills => {
                    console.log('Loaded person skills:', skills);
                    // Add a unique ID to each skill if it doesn't exist
                    const skillsWithIds = skills.map((skill, index) => ({
                        ...skill,
                        id: skill.id || (skill as any).idpersonskill || `${skill.idperson}-${skill.idskill}-${index}`
                    }));
                    setPersonSkills(skillsWithIds);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error loading person skills:', err);
                    setLoading(false);
                });
        }
    }, [selectedPerson]);

    const handlePersonSelect = (person: Person) => {
        setSelectedPerson(person);
        setAdding(false);
        setEditingId(null);
    };

    const handleAddClick = () => {
        setAdding(true);
        setFormData({ skillId: '', rating: 5 });
    };

    const handleAddSave = async () => {
        if (!selectedPerson || !formData.skillId) return;

        try {
            await addPersonSkill(selectedPerson.id, Number(formData.skillId), formData.rating);
            const updatedSkills = await getPersonSkills(selectedPerson.id);
            setPersonSkills(updatedSkills);
            setAdding(false);
            setFormData({ skillId: '', rating: 5 });
        } catch (error) {
            console.error('Error adding skill:', error);
            alert('Erreur lors de l\'ajout du skill');
        }
    };

    const handleDelete = async (skillId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce skill?')) return;

        try {
            const skillToDelete = personSkills.find(s => s.id === skillId);
            if (!skillToDelete || !selectedPerson) return;

            const response = await fetch(`${BASE_URL}/personskills/person/${selectedPerson.id}/skill/${skillToDelete.idskill}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPersonSkills(personSkills.filter(s => s.id !== skillId));
            } else {
                throw new Error('Failed to delete skill');
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Erreur lors de la suppression du skill');
        }
    };

    const handleEditClick = (skill: PersonSkill) => {
        setEditingId(skill.id);
        setEditingSkills({ ...editingSkills, [skill.id]: { ...skill } });
    };

    const handleEditSave = async (skill: PersonSkill) => {
        if (!selectedPerson) return;

        try {
            const editingSkill = editingSkills[skill.id];
            if (!editingSkill) return;

            // Delete and recreate approach
            let deleteSuccess = false;
            const deleteEndpoints = [
                `${BASE_URL}/personskills/person/${selectedPerson.id}/skill/${skill.idskill}`,
                `${BASE_URL}/personskills/${skill.idskill}`,
                `${BASE_URL}/personskills/personid/${selectedPerson.id}/skillid/${skill.idskill}`,
                `${BASE_URL}/personskills?person=${selectedPerson.id}&skill=${skill.idskill}`
            ];

            for (const endpoint of deleteEndpoints) {
                try {
                    const deleteResponse = await fetch(endpoint, { method: 'DELETE' });
                    if (deleteResponse.ok) {
                        deleteSuccess = true;
                        break;
                    }
                } catch (error) {
                    console.log('Delete failed for endpoint:', endpoint, error);
                }
            }

            if (!deleteSuccess) {
                throw new Error('Failed to delete existing skill relationship');
            }

            await addPersonSkill(selectedPerson.id, skill.idskill, editingSkill.noteskill);

            const updatedSkills = await getPersonSkills(selectedPerson.id);
            const skillsWithIds = updatedSkills.map((skill, index) => ({
                ...skill,
                id: skill.id || (skill as any).idpersonskill || `${skill.idperson}-${skill.idskill}-${index}`
            }));
            setPersonSkills(skillsWithIds);
            setEditingId(null);
        } catch (error) {
            console.error('Error updating skill:', error);
            alert('Erreur lors de la mise à jour du skill');
        }
    };

    const handleCancelEdit = (skillId: number) => {
        setEditingId(null);
        setEditingSkills(prev => {
            const newEditingSkills = { ...prev };
            delete newEditingSkills[skillId];
            return newEditingSkills;
        });
    };

    const getSkillName = (skillId: number) => {
        const skill = availableSkills.find(s => s.id === skillId);
        return skill ? skill.name : 'Unknown';
    };

    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaStar className="text-blue-600 text-sm" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Compétences des Collaborateurs</h1>
                </div>
                <p className="text-gray-600">Gérez les compétences et évaluations de chaque collaborateur</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Persons List */}
                <div className="lg:col-span-1">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Collaborateurs</h2>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-32"
                                />
                            </div>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {filteredPersons.map(person => (
                                <div
                                    key={person.id}
                                    onClick={() => handlePersonSelect(person)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                        selectedPerson?.id === person.id
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm'
                                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                            {person.name.charAt(0)}{person.firstname.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-medium">{person.name} {person.firstname}</p>
                                            <p className="text-gray-600 text-sm truncate">{person.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skills Management */}
                <div className="lg:col-span-2">
                    {selectedPerson ? (
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-8 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Compétences de {selectedPerson.name} {selectedPerson.firstname}
                                    </h2>
                                    <p className="text-gray-600 text-sm mt-1">{personSkills.length} compétence(s) évaluée(s)</p>
                                </div>
                                <button
                                    onClick={handleAddClick}
                                    disabled={adding}
                                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
                                >
                                    <FaPlus className="text-sm" />
                                    Ajouter une compétence
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Add Form */}
                                    {adding && (
                                        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Compétence</label>
                                                    <select
                                                        value={formData.skillId}
                                                        onChange={(e) => setFormData({ ...formData, skillId: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                    >
                                                        <option value="">Choisir une compétence...</option>
                                                        {availableSkills.map(skill => (
                                                            <option key={skill.id} value={skill.id}>
                                                                {skill.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Note (1-10)</label>
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="10"
                                                        value={formData.rating}
                                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                                        className="w-full mt-4"
                                                    />
                                                    <div className="text-center text-2xl font-bold text-blue-600 mt-2">{formData.rating}/10</div>
                                                </div>
                                                <div className="flex gap-3 items-end">
                                                    <button
                                                        onClick={handleAddSave}
                                                        disabled={!formData.skillId}
                                                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <FaSave className="text-sm" />
                                                        Valider
                                                    </button>
                                                    <button
                                                        onClick={() => setAdding(false)}
                                                        className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <FaTimes className="text-sm" />
                                                        Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Skills List */}
                                    {personSkills.length > 0 ? (
                                        personSkills.map(skill => (
                                            <div key={skill.id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group">
                                                {editingId === skill.id ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="flex items-center">
                                                            <span className="text-gray-900 font-medium text-lg">{getSkillName(skill.idskill)}</span>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Note (1-10)</label>
                                                            <input
                                                                type="range"
                                                                min="1"
                                                                max="10"
                                                                value={editingSkills[skill.id]?.noteskill || skill.noteskill}
                                                                onChange={(e) => {
                                                                    setEditingSkills({
                                                                        ...editingSkills,
                                                                        [skill.id]: { ...(editingSkills[skill.id] || skill), noteskill: Number(e.target.value) }
                                                                    });
                                                                }}
                                                                className="w-full"
                                                            />
                                                            <div className="text-center text-2xl font-bold text-blue-600 mt-2">
                                                                {editingSkills[skill.id]?.noteskill || skill.noteskill}/10
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 items-center">
                                                            <button
                                                                onClick={() => handleEditSave(skill)}
                                                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <FaSave className="text-sm" />
                                                                Sauvegarder
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelEdit(skill.id)}
                                                                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <FaTimes className="text-sm" />
                                                                Annuler
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                                                <FaStar className="text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="text-gray-900 font-medium text-lg">{getSkillName(skill.idskill)}</h5>
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <div className="flex gap-1">
                                                                        {[...Array(10)].map((_, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className={`w-3 h-3 rounded-full ${
                                                                                    i < skill.noteskill ? 'bg-yellow-400' : 'bg-gray-300'
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-orange-600 font-bold text-lg">{skill.noteskill}/10</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEditClick(skill)}
                                                                className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors"
                                                            >
                                                                <FaEdit className="text-blue-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(skill.id)}
                                                                className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors"
                                                            >
                                                                <FaTrash className="text-red-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FaStar className="text-gray-400 text-3xl" />
                                            </div>
                                            <p className="text-gray-600 text-lg">Aucune compétence ajoutée</p>
                                            <p className="text-gray-500 text-sm mt-2">Cliquez sur "Ajouter une compétence" pour commencer</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-12 shadow-lg text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaUser className="text-gray-400 text-4xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Sélectionnez un collaborateur</h3>
                            <p className="text-gray-600">Choisissez un collaborateur dans la liste pour gérer ses compétences</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonSkills;
