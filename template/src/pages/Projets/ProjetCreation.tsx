import React, { useState, useEffect } from 'react';
import { FaTag, FaCalendarAlt, FaCalendarCheck, FaUsers, FaAlignLeft, FaStickyNote, FaPaperclip, FaTimes, FaSpinner, FaPlus, FaCode, FaEdit, FaUserFriends, FaStar, FaUser, FaFileDownload, FaDownload, FaFile, FaProjectDiagram, FaInfo, FaSave, FaSync } from 'react-icons/fa';
import BASE_URL from '../../services/api';
import { addProject, updateProject, ajouterSkillProjet } from "../../services/projects.service";
import { getSkills } from "../../services/Skills.service";
import { deleteProjectSkill, getProjectSkillsWithDetails, updateProjectSkill, addSkillToProject } from "../../services/projectskills.service";
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
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);

    // Edit skill states
    const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
    const [editSkillValue, setEditSkillValue] = useState<{ noteskills: string }>({ noteskills: "" });

    const tabs = [
        { ref: 'basic', name: 'Informations', icon: FaInfo },
        { ref: 'tech', name: 'Technologies', icon: FaCode },
        { ref: 'rec', name: 'Recommandations', icon: FaStar },
        { ref: 'asg', name: 'Collaborateurs', icon: FaUserFriends },
        { ref: 'file', name: 'Fichier Joint', icon: FaFile },
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

        const projectSkillsData: Record<number, Array<{ idskills: number; noteskills: string }>> = {
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
        return skillsForProject.map((skillData: { idskills: number; noteskills: string }) => {
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

            // Initial load of recommendations and assignments
            fetchRecommendations();
            fetchAssignedPersons();
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

    const fetchRecommendations = async () => {
        if (!projet.id) return;
        setRecommendationsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/personproject/recommendation/${projet.id}`);
            const data = await response.json();
            setRecommendations(data.recommendations || []);
        } catch (err) {
            console.error('Error loading recommendations:', err);
        } finally {
            setRecommendationsLoading(false);
        }
    };

    const fetchAssignedPersons = async () => {
        if (!projet.id) return;
        try {
            const response = await fetch(`${BASE_URL}/personproject/${projet.id}`);
            const data = await response.json();
            setAssignedPersons(data.persons || []);
        } catch (err) {
            console.error('Error loading assigned persons:', err);
        }
    };

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
        formData.append('etat', projet.etat || 'PLANIFIÉ');

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
                alert('Projet mis à jour avec succès!');
            } else {
                const response = await addProject(formData);
                console.log('Project created response:', response);

                // Check if we got the project ID
                if (response && response.id) {
                    alert('Projet créé avec succès! Vous pouvez maintenant ajouter des technologies.');

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
                    alert('Projet créé mais l\'ID n\'a pas été retourné. Veuillez rafraîchir la page.');
                }
            }
            reloadTrigger();
        } catch (error: any) {
            console.error('Error saving project:', error);

            // Show detailed error message
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).join('\n');
                alert('Erreur de validation:\n' + errorMessages);
            } else if (error.response && error.response.data && error.response.data.error) {
                alert('Erreur: ' + error.response.data.error);
            } else {
                alert('Erreur lors de la sauvegarde du projet. Veuillez vérifier tous les champs requis.');
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
                alert('Erreur lors de la suppression : ' + (error instanceof Error ? error.message : String(error)));
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
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                <FaTag className="mr-2 inline text-blue-600" />
                                Nom du projet
                            </label>
                            <input
                                name="name"
                                onChange={handleChange}
                                type="text"
                                placeholder="Entrez le nom du projet"
                                value={projet.name}
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                <FaAlignLeft className="mr-2 inline text-blue-600" />
                                Description du projet
                            </label>
                            <textarea
                                name="description"
                                onChange={handleChange}
                                value={projet.description}
                                placeholder="Décrivez votre projet en détail..."
                                rows={6}
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                    <FaCalendarAlt className="mr-2 inline text-blue-600" />
                                    Date de début
                                </label>
                                <input
                                    name="datebegin"
                                    onChange={handleChange}
                                    type="date"
                                    value={projet.datebegin || ""}
                                    className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                    <FaCalendarCheck className="mr-2 inline text-blue-600" />
                                    Date de fin
                                </label>
                                <input
                                    name="dateend"
                                    onChange={handleChange}
                                    type="date"
                                    value={projet.dateend || ""}
                                    className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                <FaUsers className="mr-2 inline text-blue-600" />
                                Nombre de personnes requises
                            </label>
                            <input
                                name="nbrperson"
                                onChange={handleChange}
                                type="number"
                                value={projet.nbrperson || ""}
                                placeholder="Nombre de collaborateurs requis"
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                <FaStickyNote className="mr-2 inline text-blue-600" />
                                Remarques
                            </label>
                            <textarea
                                name="remark"
                                onChange={handleChange}
                                value={projet.remark}
                                placeholder="Ajoutez des remarques ou notes supplémentaires..."
                                rows={4}
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                Statut du projet <span className="text-xs font-normal text-gray-500 ml-2">(Calculé automatiquement par les dates)</span>
                            </label>
                            <select
                                name="etat"
                                value={projet.etat || 'PLANIFIÉ'}
                                onChange={(e) => setProjet({ ...projet, etat: e.target.value })}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed appearance-none"
                            >
                                <option value="PLANIFIÉ">Planifié</option>
                                <option value="EN_COURS">En cours</option>
                                <option value="TERMINÉ">Terminé</option>
                            </select>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                <FaPaperclip className="mr-2 inline text-blue-600" />
                                Fichiers du projet
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                                />
                                {file && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                                        <FaFile className="text-blue-600" />
                                        <span className="text-gray-900">{file.name}</span>
                                        <button
                                            onClick={() => setFile(null)}
                                            className="ml-auto text-red-500 hover:text-red-700 transition-colors"
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
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCode className="text-gray-400 text-2xl" />
                            </div>
                            <p className="text-gray-600 text-lg mb-2">Les technologies ne peuvent être ajoutées qu'après la création du projet</p>
                            <p className="text-gray-500 text-sm">Veuillez d'abord sauvegarder le projet dans l'onglet "Informations"</p>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Technologies requises</h3>
                            <button
                                onClick={() => setAddingSkill(true)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/25"
                            >
                                <FaPlus />
                                Ajouter une technologie
                            </button>
                        </div>

                        {addingSkill && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        value={addSkillValue.skillId}
                                        onChange={(e) => setAddSkillValue({ ...addSkillValue, skillId: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                                        className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleAddSkill}
                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg shadow-green-500/25"
                                    >
                                        Ajouter
                                    </button>
                                    <button
                                        onClick={() => setAddingSkill(false)}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {projectSkillsLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : projectSkills && Array.isArray(projectSkills) && projectSkills.length > 0 ? (
                                projectSkills.map((skill, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                                        {editingSkillIndex === idx ? (
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <FaCode className="text-blue-600 text-sm" />
                                                </div>
                                                <span className="text-gray-900 font-medium">{skill.skill?.name || skill.name || 'Unknown'}</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={editSkillValue.noteskills}
                                                    onChange={(e) => setEditSkillValue({ noteskills: e.target.value })}
                                                    className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                    placeholder="Niveau"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEditSkill(idx)}
                                                        className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors"
                                                    >
                                                        <FaSave className="text-green-600 text-sm" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEditSkill}
                                                        className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                    >
                                                        <FaTimes className="text-gray-600 text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <FaCode className="text-blue-600 text-sm" />
                                                    </div>
                                                    <span className="text-gray-900 font-medium">{skill.skill?.name || skill.name || 'Unknown'}</span>
                                                    <span className="text-gray-600 text-sm bg-gray-200 px-2 py-1 rounded-lg">Niveau: {skill.noteskills}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditSkill(idx)}
                                                        className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                                                    >
                                                        <FaEdit className="text-blue-600 text-sm" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSkill(idx)}
                                                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                                                    >
                                                        <FaTimes className="text-red-600 text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaCode className="text-gray-400 text-2xl" />
                                    </div>
                                    <p className="text-gray-600">Aucune technologie ajoutée</p>
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
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaStar className="text-gray-400 text-2xl" />
                            </div>
                            <p className="text-gray-600 text-lg mb-2">Les recommandations ne sont disponibles qu'après la création du projet</p>
                            <p className="text-gray-500 text-sm">Veuillez d'abord sauvegarder le projet et ajouter des technologies requises</p>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                Personnes recommandées par compétence
                                <button 
                                    onClick={fetchRecommendations}
                                    disabled={recommendationsLoading}
                                    title="Actualiser les recommandations"
                                    className={`p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all ${recommendationsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <FaSync className={`${recommendationsLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>Disponible</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>Indisponible</span>
                            </div>
                        </div>

                        {/* Capacity indicator */}
                        {projet.nbrperson && (
                            <div className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium ${assignedPersons.length >= projet.nbrperson
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-blue-50 border-blue-200 text-blue-700'
                                }`}>
                                <span>Capacité du projet</span>
                                <span className="font-bold">{assignedPersons.length} / {projet.nbrperson} personnes assignées</span>
                            </div>
                        )}

                        <div className="space-y-3">
                            {recommendations.length > 0 ? (
                                recommendations.map((person: any, idx: number) => {
                                    const isAvailable = person.available === true || person.available === 't' || person.available === 1 || person.available === '1';
                                    const isFull = projet.nbrperson ? assignedPersons.length >= projet.nbrperson : false;
                                    const isAlreadyAssigned = assignedPersons.some((p: any) => Number(p.idperson) === Number(person.idperson));
                                    const canAssign = isAvailable && !isFull && !isAlreadyAssigned;
                                    return (
                                        <div key={idx} className={`border rounded-xl p-4 transition-colors ${!isAvailable ? 'bg-red-50/50 border-red-200 opacity-80' :
                                            isAlreadyAssigned ? 'bg-green-50 border-green-200' :
                                                'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                            }`}>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br ${!isAvailable ? 'from-red-400 to-red-500' :
                                                        isAlreadyAssigned ? 'from-green-500 to-emerald-600' :
                                                            'from-blue-500 to-indigo-600'
                                                        }`}>
                                                        <FaUser className="text-white text-lg" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <p className="text-gray-900 font-semibold">{person.name} {person.firstname}</p>
                                                            {/* Score badge */}
                                                            <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-lg">
                                                                <FaStar className="text-xs" />
                                                                <span className="text-xs font-bold">{Number(person.matching_score || 0).toFixed(1)}/10</span>
                                                            </div>
                                                            {/* Availability badge */}
                                                            {!isAvailable && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
                                                                    Indisponible – déjà sur un projet en cours
                                                                </span>
                                                            )}
                                                            {isAlreadyAssigned && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold">
                                                                    Assigné
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-500 text-sm mb-2">{person.email}</p>
                                                        {/* Skills chips */}
                                                        {person.skills && person.skills.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {person.skills.map((skill: any, skillIdx: number) => (
                                                                    <span
                                                                        key={skillIdx}
                                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs border font-medium ${skill.is_required
                                                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                                            }`}
                                                                        title={`${skill.skill_name}: ${skill.noteskill}/10`}
                                                                    >
                                                                        <FaCode className="text-xs" />
                                                                        {skill.skill_name}
                                                                        <span className="font-bold">{skill.noteskill}</span>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Assign button */}
                                                {isAlreadyAssigned ? (
                                                    <button
                                                        onClick={() => handleUnassignPerson(Number(person.idperson))}
                                                        className="px-3 py-2 bg-red-100 text-red-700 border border-red-200 rounded-xl hover:bg-red-200 text-xs font-semibold transition-all flex-shrink-0"
                                                    >
                                                        Désassigner
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => canAssign && handleAssignPerson(Number(person.idperson))}
                                                        disabled={!canAssign}
                                                        title={!isAvailable ? 'Cette personne est déjà sur un projet en cours' : isFull ? 'Le projet a atteint sa capacité maximale' : 'Assigner cette personne'}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex-shrink-0 ${canAssign
                                                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25 cursor-pointer'
                                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {!isAvailable ? 'Indisponible' : isFull ? 'Complet' : 'Assigner'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-xl">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaStar className="text-gray-400 text-2xl" />
                                    </div>
                                    <p className="text-gray-600">Aucune personne ne correspond aux compétences requises</p>
                                    <p className="text-gray-500 text-sm mt-2">Ajoutez des technologies au projet pour obtenir des recommandations triées par niveau</p>
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
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUserFriends className="text-gray-400 text-2xl" />
                            </div>
                            <p className="text-gray-600 text-lg mb-2">Les personnes ne peuvent être assignées qu'après la création du projet</p>
                            <p className="text-gray-500 text-sm">Veuillez d'abord sauvegarder le projet</p>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Personnes assignées</h3>
                            {/* Capacity indicator */}
                            {projet.nbrperson && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${assignedPersons.length >= projet.nbrperson
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : assignedPersons.length >= projet.nbrperson * 0.8
                                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                        : 'bg-green-50 border-green-200 text-green-700'
                                    }`}>
                                    <FaUsers className="text-lg" />
                                    <span>{assignedPersons.length} / {projet.nbrperson} personnes</span>
                                    {assignedPersons.length >= projet.nbrperson && <span className="text-xs">(complet)</span>}
                                </div>
                            )}
                        </div>
                        {/* Capacity progress bar */}
                        {projet.nbrperson && projet.nbrperson > 0 && (
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${assignedPersons.length >= projet.nbrperson ? 'bg-red-500' :
                                        assignedPersons.length >= projet.nbrperson * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${Math.min((assignedPersons.length / projet.nbrperson) * 100, 100)}%` }}
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            {assignedPersons.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-xl">
                                    <FaUsers className="text-gray-400 text-2xl mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">Aucune personne assignée — utilisez l'onglet Recommandations pour assigner</p>
                                </div>
                            ) : (
                                assignedPersons.map((person: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                                <FaUser className="text-white text-sm" />
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-medium">{person.name} {person.firstname}</p>
                                                <p className="text-gray-600 text-sm">{person.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleUnassignPerson(Number(person.idperson))}
                                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/25"
                                        >
                                            Désassigner
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );

            case 'file':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Fichiers du projet</h3>
                        {projet.file ? (
                            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <FaFileDownload className="text-white text-2xl" />
                                </div>
                                <a
                                    href={`${BASE_URL}/projects/download/${projet.file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/25"
                                >
                                    <FaDownload />
                                    Télécharger le fichier
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaFile className="text-gray-400 text-2xl" />
                                </div>
                                <p className="text-gray-600">Aucun fichier joint</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl shadow-lg animate-fade-in">
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaProjectDiagram className="text-blue-600 text-sm" />
                    </div>
                    {actionName} un projet
                </h2>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-1 p-4 overflow-x-auto no-scrollbar">
                    {tabs.map((tab, index) => {
                        const IconComponent = tab.icon;
                        const isBasicTab = tab.ref === 'basic';
                        const isDisabled = !isBasicTab && !projet.id;

                        return (
                            <button
                                key={tab.ref}
                                onClick={() => !isDisabled && setActiveTab(index)}
                                disabled={isDisabled}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === index
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                    : isDisabled
                                        ? 'text-gray-400 cursor-not-allowed opacity-50 bg-gray-100'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                title={isDisabled ? 'Veuillez d\'abord créer le projet' : ''}
                            >
                                <IconComponent className="w-4 h-4 flex-shrink-0" />
                                <span>{tab.name}</span>
                                {isDisabled && <span className="text-xs"></span>}
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
            <div className="border-t border-gray-200 p-6">
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={() => reloadTrigger()}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={submitProjet}
                        disabled={submitting}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <FaSave />
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
