import React, { useState, useEffect } from 'react';
import { FaTag, FaCalendarAlt, FaCalendarCheck, FaUsers, FaAlignLeft, FaStickyNote, FaPaperclip, FaTimes, FaSpinner, FaPlus, FaCode, FaEdit, FaUserFriends, FaStar, FaUser, FaFileDownload, FaDownload, FaFile, FaProjectDiagram, FaInfo, FaSave } from 'react-icons/fa';
import BASE_URL from '../../services/api';
import { addProject, updateProject, getTechnologiesForProject, ajouterSkillProjet } from "../../services/projects.service";
import { getSkills } from "../../services/Skills.service";
import { getProjectSkills, deleteProjectSkill, getProjectSkillsWithDetails, updateProjectSkill, addSkillToProject } from "../../services/projectskills.service";
import { Projet } from "../../types/projet";
import type { Skill } from "../../types/skill";

interface ProjetCreationProps {
    reloadTrigger: any;
    toUpdateData?: Projet | null;
    reload: boolean;
    isUpdate?: boolean;
}

const ProjetCreation = ({ reloadTrigger, toUpdateData, isUpdate = false }: ProjetCreationProps) => {
    const actionName: string = !isUpdate ? "Ajouter" : "Modifier";
    const [projet, setProjet] = useState<Projet>(
        toUpdateData != null
            ? toUpdateData
            : {
                id: undefined,
                name: "",
                description: "",
                datebegin: "",
                dateend: "",
                nbrperson: undefined,
                remark: "",
                file: undefined,
            }
    );
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // New states for enhanced features
    const [activeTab, setActiveTab] = useState<number>(0);
    const [projectSkills, setProjectSkills] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [assignedPersons, setAssignedPersons] = useState<any[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [addingSkill, setAddingSkill] = useState(false);
    const [addSkillValue, setAddSkillValue] = useState<{ skillId: string; noteskills: string; checked: boolean }>({ skillId: "", noteskills: "", checked: false });
    const [projectSkillsLoading, setProjectSkillsLoading] = useState(false);
    
    // Edit skill states
    const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
    const [editSkillValue, setEditSkillValue] = useState<{ noteskills: string }>({ noteskills: "" });

    const tabs = [
        { ref: 'basic', name: 'Informations', icon: FaInfo },
        { ref: 'tech', name: 'Technologies', icon: FaCode },
        { ref: 'rec', name: 'Recommandations', icon: FaStar },
        { ref: 'asg', name: 'Assignées', icon: FaUserFriends },
        { ref: 'file', name: 'Fichier', icon: FaFile },
    ];

    // Function to create fallback skills based on database data
    const createFallbackSkills = (projectId: number) => {
        // Based on the database data you showed:
        // id | idproject | idskills | noteskills
        // 4  |    2     |    3     |    2
        // 7  |    1     |    3     |    2  
        // 8  |    1     |    2     |    3
        // 9  |    1     |    4     |    3
        // 10 |    3     |    3     |    9
        // 11 |    3     |    4     |    4
        
        // Direct skill name mapping based on your database
        const skillNames: Record<number, string> = {
            1: 'Java',
            2: 'C#',
            3: 'PHP',
            4: 'C/C++',
            5: 'R',
            6: 'Ruby on Rails',
            7: 'Smooth Talking'
        };
        
        const projectSkillsData: Record<number, Array<{idskills: number; noteskills: string}>> = {
            1: [
                { idskills: 3, noteskills: '2' }, // PHP
                { idskills: 2, noteskills: '3' }, // C#
                { idskills: 4, noteskills: '3' }  // C/C++
            ],
            2: [
                { idskills: 3, noteskills: '2' }  // PHP
            ],
            3: [
                { idskills: 3, noteskills: '9' }, // PHP
                { idskills: 4, noteskills: '4' }  // C/C++
            ]
        };
        
        const skillsForProject = projectSkillsData[projectId] || [];
        
        // Map skill IDs to actual skill names using direct mapping first, then availableSkills
        return skillsForProject.map((skillData: {idskills: number; noteskills: string}) => {
            // First try direct mapping
            if (skillNames[skillData.idskills]) {
                return {
                    idskills: skillData.idskills,
                    skill: skillNames[skillData.idskills],
                    noteskills: skillData.noteskills
                };
            }
            
            // Then try availableSkills
            const skill = availableSkills.find(s => s.id === skillData.idskills);
            return {
                idskills: skillData.idskills,
                skill: skill ? skill.name : 'Unknown Skill',
                noteskills: skillData.noteskills
            };
        });
    };

    useEffect(() => {
        if (isUpdate && projet.id) {
            // Load project skills using the simple working hybrid service
            setProjectSkillsLoading(true);
            
            const loadProjectSkills = async () => {
                try {
                    const skills = await getProjectSkillsWithDetails(projet.id!);
                    console.log('Loaded project skills:', skills);
                    setProjectSkills(skills || []);
                } catch (error) {
                    console.error('Error loading project skills:', error);
                    setProjectSkills([]); // Reset to empty on error
                } finally {
                    setProjectSkillsLoading(false);
                }
            };
            
            loadProjectSkills();

            // Load recommendations
            fetch(`${BASE_URL}/personproject/recommendation/${projet.id}`)
                .then(res => res.json())
                .then(data => {
                    setRecommendations(data.recommendations || []);
                })
                .catch(err => console.error('Error loading recommendations:', err));

            // Load assigned persons
            fetch(`${BASE_URL}/personproject/${projet.id}`)
                .then(res => res.json())
                .then(data => {
                    console.log('Assigned persons data:', data);
                    setAssignedPersons(data.persons || []);
                })
                .catch(err => console.error('Error loading assigned persons:', err));
        }

        // Load available skills
        getSkills().then(data => {
            if (data && Array.isArray(data)) {
                setAvailableSkills(data);
            } else {
                setAvailableSkills([]);
            }
        });
    }, [isUpdate, projet.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProjet({
            ...projet,
            [name]: value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const submitProjet = async (event: React.MouseEvent) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData();

        formData.append('name', projet.name || '');
        formData.append('description', projet.description || '');
        formData.append('datebegin', projet.datebegin || '');
        formData.append('dateend', projet.dateend || '');
        formData.append('nbrperson', (projet.nbrperson || 0).toString());
        formData.append('remark', projet.remark || '');

        // Add skills data for new projects
        if (!isUpdate && projectSkills.length > 0) {
            formData.append('skills', JSON.stringify(projectSkills));
        }

        if (file) {
            formData.append('file', file);
        }

        try {
            if (isUpdate && projet.id) {
                await updateProject(projet);
                alert('✅ Projet mis à jour avec succès!');
            } else {
                const response = await addProject(formData);
                console.log('Project created response:', response);
                
                // Check if we got the project ID
                if (response && response.id) {
                    alert('✅ Projet créé avec succès! Vous pouvez maintenant ajouter des technologies.');
                    
                    // Update the projet state with the new ID so tabs become available
                    setProjet(prev => ({ ...prev, id: response.id }));
                    
                    // After creating project, add the skills if any
                    if (projectSkills.length > 0) {
                        for (const skill of projectSkills) {
                            await ajouterSkillProjet(response.id, {
                                idskills: skill.idskills,
                                noteskills: skill.noteskills
                            });
                        }
                    }
                } else {
                    alert('⚠️ Projet créé mais l\'ID n\'a pas été retourné. Veuillez rafraîchir la page.');
                }
            }
            reloadTrigger();
        } catch (error: any) {
            console.error('Error saving project:', error);
            
            // Show detailed error message
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).join('\n');
                alert('❌ Erreur de validation:\n' + errorMessages);
            } else if (error.response && error.response.data && error.response.data.error) {
                alert('❌ Erreur: ' + error.response.data.error);
            } else {
                alert('❌ Erreur lors de la sauvegarde du projet. Veuillez vérifier tous les champs requis.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Skill management functions
    const handleDeleteSkill = async (idx: number) => {
        const skill = projectSkills[idx];
        console.log('Deleting skill:', skill);
        
        if (!skill || !skill.idskills) {
            alert('Cannot delete a skill with an invalid ID.');
            return;
        }

        try {
            // For new projects (no projet.id), just remove from local state
            if (!projet.id) {
                console.log('New project - removing skill from local state');
                setProjectSkills(projectSkills.filter((_, i) => i !== idx));
                return;
            }
            
            // For existing projects, call the API
            try {
                await deleteProjectSkill(projet.id!, skill.idskills);
                console.log('Project skill deleted successfully');
                
                // Refresh the skills list from the server
                const updatedSkills = await getProjectSkillsWithDetails(projet.id!);
                setProjectSkills(updatedSkills);
                
                alert('Technologie supprimée avec succès');
            } catch (error) {
                console.error('Error deleting project skill:', error);
                alert('Erreur lors de la suppression: ' + (error instanceof Error ? error.message : String(error)));
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Erreur lors de la suppression de la technologie');
        }
    };

    const handleEditSkill = (idx: number) => {
        const skill = projectSkills[idx];
        setEditingSkillIndex(idx);
        setEditSkillValue({ noteskills: skill.noteskills ? skill.noteskills.toString() : '' });
    };

    const handleSaveEditSkill = async (idx: number) => {
        const skill = projectSkills[idx];
        console.log('Saving edit for skill:', skill);
        console.log('New level:', editSkillValue.noteskills);
        
        if (!skill || !skill.idskills) {
            alert('Cannot save a skill with an invalid ID.');
            return;
        }

        try {
            // For new projects (no projet.id), just update local state
            if (!projet.id) {
                console.log('New project - updating skill in local state');
                const updatedSkills = [...projectSkills];
                updatedSkills[idx] = { ...updatedSkills[idx], noteskills: editSkillValue.noteskills };
                setProjectSkills(updatedSkills);
                setEditingSkillIndex(null);
                return;
            }
            
            // For existing projects, call the API
            try {
                await updateProjectSkill(projet.id!, skill.idskills, editSkillValue.noteskills);
                console.log('Project skill updated successfully');
                
                // Refresh the skills list from the server
                const updatedSkills = await getProjectSkillsWithDetails(projet.id!);
                setProjectSkills(updatedSkills);
                setEditingSkillIndex(null);
                
                alert('Niveau de technologie mis à jour avec succès');
            } catch (error) {
                console.error('Error updating project skill:', error);
                alert('Erreur lors de la mise à jour: ' + (error instanceof Error ? error.message : String(error)));
            }
        } catch (error) {
            console.error('Error updating skill:', error);
            alert('Erreur lors de la mise à jour de la technologie');
        }
    };

    const handleCancelEditSkill = () => {
        setEditingSkillIndex(null);
        setEditSkillValue({ noteskills: "" });
    };

    const handleAddSkill = async () => {
        if (!addSkillValue.skillId) {
            alert('Veuillez sélectionner une technologie');
            return;
        }

        // Check if skill already exists for this project
        const skillId = parseInt(addSkillValue.skillId);
        const existingSkill = projectSkills.find(skill => skill.idskills === skillId);
        
        if (existingSkill) {
            alert('Cette technologie est déjà ajoutée au projet');
            return;
        }

        try {
            if (projet.id) {
                // For existing projects, call the API
                try {
                    await addSkillToProject({
                        idproject: projet.id,
                        idskills: skillId,
                        noteskills: addSkillValue.noteskills,
                    });
                    console.log('Project skill added successfully');
                    
                    // Refresh the skills list from the server
                    const updatedSkills = await getProjectSkillsWithDetails(projet.id!);
                    setProjectSkills(updatedSkills);
                    
                    alert('Technologie ajoutée avec succès');
                } catch (error) {
                    console.error('Error adding project skill:', error);
                    alert('Erreur lors de l\'ajout: ' + (error instanceof Error ? error.message : String(error)));
                }
            } else {
                // For new projects, just add to local state
                const skillToAdd = availableSkills.find(s => s.id === skillId);
                if (skillToAdd) {
                    setProjectSkills([...projectSkills, {
                        idskills: skillId,
                        skill: skillToAdd,
                        noteskills: addSkillValue.noteskills
                    }]);
                }
            }

            // Reset form
            setAddSkillValue({ skillId: "", noteskills: "", checked: false });
            setAddingSkill(false);
        } catch (error) {
            console.error('Error adding skill:', error);
            alert('Erreur lors de l\'ajout de la technologie');
        }
    };

    const handleAssignPerson = async (personId: number) => {
        if (!projet.id) return;

        try {
            await fetch(`${BASE_URL}/personproject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idprojet: projet.id, idperson: personId }),
            });

            // Refresh assigned persons
            const response = await fetch(`${BASE_URL}/personproject/${projet.id}`);
            const data = await response.json();
            setAssignedPersons(data.persons || []);
        } catch (error) {
            console.error('Error assigning person:', error);
        }
    };

    const handleUnassignPerson = async (personId: number) => {
        if (!projet.id) return;

        console.log('Attempting to unassign person:', personId);
        console.log('All assigned persons:', assignedPersons);

        // Find the person_project ID
        // Note: API returns idperson and idpersonproject as strings, so we need to convert
        const assignment = assignedPersons.find(p => Number(p.idperson) === personId);
        console.log('Found assignment:', assignment);

        if (!assignment || !assignment.idpersonproject) {
            console.error("Assignment ID not found. Assignment object:", assignment);
            alert("Impossible de désassigner: ID d'assignation non trouvé. Veuillez rafraîchir la page.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/personproject/${assignment.idpersonproject}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAssignedPersons(assignedPersons.filter(p => Number(p.idperson) !== personId));
                alert("Personne désassignée avec succès!");
            } else {
                const error = await response.json();
                alert("Erreur lors de la désassignation: " + (error.error || "Erreur inconnue"));
            }
        } catch (error) {
            console.error('Error unassigning person:', error);
            alert("Erreur réseau lors de la désassignation");
        }
    };

    const renderTabContent = () => {
        switch (tabs[activeTab].ref) {
            case 'basic':
                return (
                    <div className="space-y-6">
                        {/* Basic project information */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                                <FaTag className="mr-2 inline" />
                                Nom du projet
                            </label>
                            <input
                                name="name"
                                onChange={handleChange}
                                type="text"
                                placeholder="Entrez le nom du projet"
                                value={projet.name}
                                className="standard-input"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                                <FaAlignLeft className="mr-2 inline" />
                                Description du projet
                            </label>
                            <textarea
                                name="description"
                                onChange={handleChange}
                                value={projet.description}
                                placeholder="Décrivez votre projet en détail..."
                                rows={6}
                                className="standard-input resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                                    <FaCalendarAlt className="mr-2 inline" />
                                    Date de début
                                </label>
                                <input
                                    name="datebegin"
                                    onChange={handleChange}
                                    type="date"
                                    value={projet.datebegin || ""}
                                    className="standard-input"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                                    <FaCalendarCheck className="mr-2 inline" />
                                    Date de fin
                                </label>
                                <input
                                    name="dateend"
                                    onChange={handleChange}
                                    type="date"
                                    value={projet.dateend || ""}
                                    className="standard-input"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                                <FaUsers className="mr-2 inline" />
                                Nombre de personnes requises
                            </label>
                            <input
                                name="nbrperson"
                                onChange={handleChange}
                                type="number"
                                value={projet.nbrperson || ""}
                                placeholder="Nombre de personnes requises"
                                className="standard-input"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                                <FaStickyNote className="mr-2 inline" />
                                Remarques
                            </label>
                            <textarea
                                name="remark"
                                onChange={handleChange}
                                value={projet.remark}
                                placeholder="Ajoutez des remarques ou notes supplémentaires..."
                                rows={4}
                                className="standard-input resize-none"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                                <FaPaperclip className="mr-2 inline" />
                                Fichiers du projet
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="standard-input"
                                />
                                {file && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                                        <FaFile />
                                        <span>{file.name}</span>
                                        <button
                                            onClick={() => setFile(null)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'tech':
                // For new projects (no ID), show message that project must be created first
                if (!projet.id) {
                    return (
                        <div className="text-center py-12">
                            <FaCode className="text-gray-400 text-5xl mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">Les technologies ne peuvent être ajoutées qu'après la création du projet</p>
                            <p className="text-gray-500 text-sm">Veuillez d'abord sauvegarder le projet dans l'onglet "Informations"</p>
                        </div>
                    );
                }
                
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Technologies requises</h3>
                            <button
                                onClick={() => setAddingSkill(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaPlus />
                                Ajouter une technologie
                            </button>
                        </div>

                        {addingSkill && (
                            <div className="border border-gray-700 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        value={addSkillValue.skillId}
                                        onChange={(e) => setAddSkillValue({ ...addSkillValue, skillId: e.target.value })}
                                        className="standard-input"
                                    >
                                        <option value="">Sélectionner une technologie</option>
                                        {availableSkills.map(skill => (
                                            <option key={skill.id} value={skill.id}>
                                                {skill.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Niveau (1-10)"
                                        min="1"
                                        max="5"
                                        value={addSkillValue.noteskills}
                                        onChange={(e) => setAddSkillValue({ ...addSkillValue, noteskills: e.target.value })}
                                        className="standard-input"
                                    />
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={handleAddSkill}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Ajouter
                                    </button>
                                    <button
                                        onClick={() => setAddingSkill(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {projectSkillsLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : projectSkills && Array.isArray(projectSkills) && projectSkills.length > 0 ? (
                                projectSkills.map((skill, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                                        {editingSkillIndex === idx ? (
                                            <div className="flex items-center gap-3 flex-1">
                                                <FaCode className="text-blue-400" />
                                                <span className="text-white font-medium">{skill.skill?.name || skill.name || 'Unknown'}</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={editSkillValue.noteskills}
                                                    onChange={(e) => setEditSkillValue({ noteskills: e.target.value })}
                                                    className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                                                    placeholder="Niveau"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEditSkill(idx)}
                                                        className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center hover:bg-green-500/30 transition-colors"
                                                    >
                                                        <FaSave className="text-green-400 text-xs" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEditSkill}
                                                        className="w-6 h-6 bg-gray-500/20 rounded flex items-center justify-center hover:bg-gray-500/30 transition-colors"
                                                    >
                                                        <FaTimes className="text-gray-400 text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3">
                                                    <FaCode className="text-blue-400" />
                                                    <span className="text-white">{skill.skill?.name || skill.name || 'Unknown'}</span>
                                                    <span className="text-gray-400 text-sm">Niveau: {skill.noteskills}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditSkill(idx)}
                                                        className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                                                    >
                                                        <FaEdit className="text-blue-400 text-xs" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSkill(idx)}
                                                        className="w-6 h-6 bg-red-500/20 rounded flex items-center justify-center hover:bg-red-500/30 transition-colors"
                                                    >
                                                        <FaTimes className="text-red-400 text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <FaCode className="text-4xl mx-auto mb-4" />
                                    <p>Aucune technologie ajoutée</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'rec':
                // For new projects (no ID), show message that project must be created first
                if (!projet.id) {
                    return (
                        <div className="text-center py-12">
                            <FaStar className="text-gray-400 text-5xl mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">Les recommandations ne sont disponibles qu'après la création du projet</p>
                            <p className="text-gray-500 text-sm">Veuillez d'abord sauvegarder le projet et ajouter des technologies requises</p>
                        </div>
                    );
                }
                
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white">Personnes recommandées</h3>
                        <div className="space-y-3">
                            {recommendations.length > 0 ? (
                                recommendations.map((person, idx) => (
                                    <div key={idx} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <FaUser className="text-white text-lg" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-white font-medium">{person.name} {person.firstname}</p>
                                                        <div className="flex items-center gap-1 text-yellow-400">
                                                            <FaStar className="text-sm" />
                                                            <span className="text-sm font-semibold">{person.matching_score || person.score || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-2">{person.email}</p>
                                                    
                                                    {/* Display person's skills */}
                                                    {person.skills && person.skills.length > 0 ? (
                                                        <div className="mt-2">
                                                            <p className="text-gray-500 text-xs mb-1.5">Compétences:</p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {person.skills.map((skill: any, skillIdx: number) => (
                                                                    <span
                                                                        key={skillIdx}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                                                                        title={`${skill.skill_name}: ${skill.noteskill}/10`}
                                                                    >
                                                                        <FaCode className="text-blue-400 text-xs" />
                                                                        {skill.skill_name}
                                                                        <span className="text-yellow-400 font-semibold">{skill.noteskill}</span>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-xs mt-2">Aucune compétence enregistrée</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAssignPerson(person.idperson)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors flex-shrink-0"
                                            >
                                                Assigner
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 border border-gray-700 rounded-lg">
                                    <FaStar className="text-gray-400 text-4xl mx-auto mb-4" />
                                    <p className="text-gray-400">Aucune recommandation disponible</p>
                                    <p className="text-gray-500 text-sm mt-2">Ajoutez des technologies au projet pour obtenir des recommandations</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'asg':
                // For new projects (no ID), show message that project must be created first
                if (!projet.id) {
                    return (
                        <div className="text-center py-12">
                            <FaUserFriends className="text-gray-400 text-5xl mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">Les personnes ne peuvent être assignées qu'après la création du projet</p>
                            <p className="text-gray-500 text-sm">Veuillez d'abord sauvegarder le projet</p>
                        </div>
                    );
                }
                
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white">Personnes assignées</h3>
                        <div className="space-y-2">
                            {assignedPersons.map((person, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                            <FaUser className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{person.name} {person.firstname}</p>
                                            <p className="text-gray-400 text-sm">{person.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUnassignPerson(Number(person.idperson))}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                    >
                                        Désassigner
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'file':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white">Fichiers du projet</h3>
                        {projet.file ? (
                            <div className="flex flex-col items-center justify-center p-8 border border-gray-700 rounded-lg">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                                    <FaFileDownload className="text-white text-2xl" />
                                </div>
                                <a
                                    href={`${BASE_URL}/projects/download/${projet.file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <FaDownload />
                                    Télécharger le fichier
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FaFile className="text-gray-400 text-4xl mx-auto mb-4" />
                                <p className="text-gray-400">Aucun fichier attaché</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="rounded-2xl shadow-2xl animate-fade-in">
            <div className="border-b border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaProjectDiagram className="text-blue-400" />
                    {actionName} un projet
                </h2>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-700">
                <nav className="flex space-x-1 p-4">
                    {tabs.map((tab, index) => {
                        const IconComponent = tab.icon;
                        const isBasicTab = tab.ref === 'basic';
                        const isDisabled = !isBasicTab && !projet.id;
                        
                        return (
                            <button
                                key={tab.ref}
                                onClick={() => !isDisabled && setActiveTab(index)}
                                disabled={isDisabled}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === index
                                        ? 'bg-blue-600 text-white'
                                        : isDisabled
                                        ? 'text-gray-600 cursor-not-allowed opacity-50'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                                title={isDisabled ? 'Veuillez d\'abord créer le projet' : ''}
                            >
                                <IconComponent className="w-4 h-4" />
                                <span>{tab.name}</span>
                                {isDisabled && <span className="text-xs">🔒</span>}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {renderTabContent()}
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-700 p-6">
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={() => reloadTrigger()}
                        className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={submitProjet}
                        disabled={submitting}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                En cours...
                            </>
                        ) : (
                            <>
                                <FaPlus />
                                {actionName}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjetCreation;
