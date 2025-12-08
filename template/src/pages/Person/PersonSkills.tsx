import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaUser, FaStar } from 'react-icons/fa';
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

    // Add/Edit state
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        skillId: '',
        rating: 5
    });
    const [editingSkills, setEditingSkills] = useState<{[key: number]: PersonSkill}>({});

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
                    console.log('First skill structure:', skills[0]);
                    // Add a unique ID to each skill if it doesn't exist
                    const skillsWithIds = skills.map((skill, index) => ({
                        ...skill,
                        id: skill.id || (skill as any).idpersonskill || `${skill.idperson}-${skill.idskill}-${index}`
                    }));
                    console.log('Skills with IDs:', skillsWithIds);
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
            // Find the skill to get its person and skill IDs
            const skillToDelete = personSkills.find(s => s.id === skillId);
            if (!skillToDelete || !selectedPerson) return;
            
            // Use the API endpoint with person and skill IDs
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
        setEditingSkills({...editingSkills, [skill.id]: {...skill}});
    };

    const handleEditSave = async (skill: PersonSkill) => {
        if (!selectedPerson) return;

        console.log('Editing skill:', skill);
        console.log('All skill fields:', Object.keys(skill));

        try {
            const editingSkill = editingSkills[skill.id];
            if (!editingSkill) {
                console.error('No editing skill found for ID:', skill.id);
                return;
            }
            
            // Since we can't find a valid API ID for updating, we'll delete and recreate the relationship
            console.log('Using delete and recreate approach...');
            console.log('Person ID:', selectedPerson.id, 'Skill ID:', skill.idskill, 'New rating:', editingSkill.noteskill);
            
            // Try multiple delete endpoints
            let deleteSuccess = false;
            const deleteEndpoints = [
                `${BASE_URL}/personskills/person/${selectedPerson.id}/skill/${skill.idskill}`,
                `${BASE_URL}/personskills/${skill.idskill}`,
                `${BASE_URL}/personskills/personid/${selectedPerson.id}/skillid/${skill.idskill}`,
                `${BASE_URL}/personskills?person=${selectedPerson.id}&skill=${skill.idskill}`
            ];
            
            for (const endpoint of deleteEndpoints) {
                try {
                    console.log('Trying delete endpoint:', endpoint);
                    const deleteResponse = await fetch(endpoint, {
                        method: 'DELETE',
                    });
                    if (deleteResponse.ok) {
                        console.log('Delete successful with endpoint:', endpoint);
                        deleteSuccess = true;
                        break;
                    }
                } catch (error) {
                    console.log('Delete failed for endpoint:', endpoint, error);
                }
            }
            
            if (!deleteSuccess) {
                throw new Error('Failed to delete existing skill relationship - no working endpoint found');
            }
            
            // Add the new relationship with updated rating
            await addPersonSkill(selectedPerson.id, skill.idskill, editingSkill.noteskill);
            
            // Refresh the skills list from server
            const updatedSkills = await getPersonSkills(selectedPerson.id);
            // Add IDs to the refreshed skills
            const skillsWithIds = updatedSkills.map((skill, index) => ({
                ...skill,
                id: skill.id || (skill as any).idpersonskill || `${skill.idperson}-${skill.idskill}-${index}`
            }));
            setPersonSkills(skillsWithIds);
            setEditingId(null);
            setEditingSkills({...editingSkills, [skill.id]: {...skill}});
        } catch (error) {
            console.error('Error updating skill:', error);
            alert('Erreur lors de la mise à jour du skill');
        }
    };

    const handleCancelEdit = (skillId: number) => {
        setEditingId(null);
        setEditingSkills(prev => {
            const newEditingSkills = {...prev};
            delete newEditingSkills[skillId];
            return newEditingSkills;
        });
    };

    const getSkillName = (skillId: number) => {
        const skill = availableSkills.find(s => s.id === skillId);
        return skill ? skill.name : 'Unknown';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Gestion des Compétences</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Persons List */}
                    <div className="lg:col-span-1">
                        <div className="dark-card rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Personnes</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {persons.map(person => (
                                    <div
                                        key={person.id}
                                        onClick={() => handlePersonSelect(person)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${selectedPerson?.id === person.id
                                            ? 'bg-blue-500/20 border-2 border-blue-500'
                                            : 'bg-gray-700/50 hover:bg-gray-700 border-2 border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <FaUser className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{person.name} {person.firstname}</p>
                                                <p className="text-gray-400 text-sm">{person.email}</p>
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
                            <div className="dark-card rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">
                                        Compétences de {selectedPerson.name} {selectedPerson.firstname}
                                    </h2>
                                    <button
                                        onClick={handleAddClick}
                                        disabled={adding}
                                        className="dark-button-primary px-4 py-2 rounded-xl font-medium flex items-center gap-2"
                                    >
                                        <FaPlus /> Ajouter
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* Add Form */}
                                        {adding && (
                                            <div className="dark-card p-4 rounded-xl border-l-4 border-green-500">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <select
                                                        value={formData.skillId}
                                                        onChange={(e) => setFormData({ ...formData, skillId: e.target.value })}
                                                        className="dark-input"
                                                    >
                                                        <option value="">Choisir un skill...</option>
                                                        {availableSkills.map(skill => (
                                                            <option key={skill.id} value={skill.id}>
                                                                {skill.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div>
                                                        <label className="text-gray-400 text-sm mb-1 block">Note (1-10)</label>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="10"
                                                            value={formData.rating}
                                                            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                                            className="w-full"
                                                        />
                                                        <div className="text-center text-white font-bold text-lg">{formData.rating}/10</div>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={handleAddSave}
                                                            disabled={!formData.skillId}
                                                            className="dark-button-success px-3 py-2 rounded-lg flex-1"
                                                        >
                                                            <FaSave className="inline mr-1" /> Valider
                                                        </button>
                                                        <button
                                                            onClick={() => setAdding(false)}
                                                            className="dark-button-secondary px-3 py-2 rounded-lg flex-1"
                                                        >
                                                            <FaTimes className="inline mr-1" /> Annuler
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Skills List */}
                                        {(() => { console.log('Rendering skills list:', personSkills, 'Length:', personSkills.length); return null; })()}
                                        {personSkills.length > 0 ? (
                                            personSkills.map(skill => (
                                                <div key={skill.id} className="dark-card p-4 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group">
                                                    {(() => { console.log('Rendering skill:', skill); return null; })()}
                                                    {editingId === skill.id ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="flex items-center">
                                                                <span className="text-white font-medium">{getSkillName(skill.idskill)}</span>
                                                            </div>
                                                            <div>
                                                                <label className="text-gray-400 text-sm mb-1 block">Note (1-10)</label>
                                                                <input
                                                                    type="range"
                                                                    min="1"
                                                                    max="10"
                                                                    value={editingSkills[skill.id]?.noteskill || skill.noteskill}
                                                                    onChange={(e) => {
                                                                        setEditingSkills({
                                                                            ...editingSkills,
                                                                            [skill.id]: {...(editingSkills[skill.id] || skill), noteskill: Number(e.target.value)}
                                                                        });
                                                                    }}
                                                                    className="w-full"
                                                                />
                                                                <div className="text-center text-white font-bold text-lg">
                                                                    {editingSkills[skill.id]?.noteskill || skill.noteskill}/10
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <button
                                                                    onClick={() => handleEditSave(skill)}
                                                                    className="dark-button-success px-3 py-2 rounded-lg flex-1"
                                                                >
                                                                    <FaSave className="inline mr-1" /> Save
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelEdit(skill.id)}
                                                                    className="dark-button-secondary px-3 py-2 rounded-lg flex-1"
                                                                >
                                                                    <FaTimes className="inline mr-1" /> Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4 flex-1">
                                                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                                                    <FaStar className="text-white" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h5 className="text-white font-medium">{getSkillName(skill.idskill)}</h5>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <div className="flex gap-1">
                                                                            {[...Array(10)].map((_, i) => (
                                                                                <div
                                                                                    key={i}
                                                                                    className={`w-2 h-2 rounded-full ${i < skill.noteskill ? 'bg-yellow-400' : 'bg-gray-600'
                                                                                        }`}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-yellow-400 font-bold">{skill.noteskill}/10</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleEditClick(skill)}
                                                                    className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                                                                >
                                                                    <FaEdit className="text-blue-400 text-sm" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(skill.id)}
                                                                    className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors"
                                                                >
                                                                    <FaTrash className="text-red-400 text-sm" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                {(() => { console.log('Showing empty state - no skills found'); return null; })()}
                                                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FaStar className="text-gray-400 text-2xl" />
                                                </div>
                                                <p className="text-gray-400">Aucune compétence ajoutée</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="dark-card rounded-xl p-12 text-center">
                                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaUser className="text-gray-400 text-3xl" />
                                </div>
                                <p className="text-gray-400 text-lg">Sélectionnez une personne pour gérer ses compétences</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonSkills;
