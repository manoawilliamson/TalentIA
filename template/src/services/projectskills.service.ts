import axios from 'axios';
import BASE_URL from './api';

export interface ProjectSkill {
    id?: number;
    idproject: number;
    idskills: number;
    noteskills: string;
    skill?: {
        id: number;
        name: string;
        category: string;
    };
}

// CREATE - Add skill to project
export const addSkillToProject = async (projectSkill: Omit<ProjectSkill, 'id'>) => {
    try {
        const response = await axios.post(`${BASE_URL}/projectskills`, projectSkill);
        return response.data;
    } catch (error) {
        console.error('Error adding skill to project:', error);
        throw error;
    }
};

// READ - Get all skills for a project
export const getProjectSkills = async (projectId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/projectskills/list/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting project skills:', error);
        throw error;
    }
};

// UPDATE - Update skill level in project
export const updateProjectSkill = async (projectId: number, skillId: number, noteskills: string) => {
    try {
        const response = await axios.put(`${BASE_URL}/projectskills/${projectId}/${skillId}`, { noteskills });
        return response.data;
    } catch (error) {
        console.error('Error updating project skill:', error);
        throw error;
    }
};

// DELETE - Remove skill from project
export const deleteProjectSkill = async (projectId: number, skillId: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/projectskills/${projectId}/${skillId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting project skill:', error);
        throw error;
    }
};

// BULK OPERATIONS

// Add multiple skills to project
export const addMultipleSkillsToProject = async (projectId: number, skills: Array<{idskills: number; noteskills: string}>) => {
    try {
        const promises = skills.map(skill => 
            addSkillToProject({ idproject: projectId, idskills: skill.idskills, noteskills: skill.noteskills })
        );
        const results = await Promise.allSettled(promises);
        return results;
    } catch (error) {
        console.error('Error adding multiple skills to project:', error);
        throw error;
    }
};

// Get all project skills with skill details (JOIN operation)
export const getProjectSkillsWithDetails = async (projectId: number) => {
    try {
        const projectSkills = await getProjectSkills(projectId);
        
        // Ensure projectSkills is an array before proceeding
        if (!Array.isArray(projectSkills)) {
            // If the response is not an array, return an empty array or handle as an error
            return [];
        }

        // If the API doesn't return skill details, fetch them separately
        if (projectSkills.length > 0 && !projectSkills[0].skill) {
            // Fetch skill details for each skill
            const skillsWithDetails = await Promise.all(
                projectSkills.map(async (ps: any) => {
                    if (!ps.idskills) {
                        return {
                            ...ps,
                            skill: { id: null, name: 'Invalid Skill ID', category: 'Unknown' }
                        };
                    }
                    try {
                        const skillResponse = await axios.get(`${BASE_URL}/skills/${ps.idskills}`);
                        return {
                            ...ps,
                            skill: skillResponse.data
                        };
                    } catch (error) {
                        return {
                            ...ps,
                            skill: { id: ps.idskills, name: 'Unknown', category: 'Unknown' }
                        };
                    }
                })
            );
            return skillsWithDetails;
        }
        
        return projectSkills;
    } catch (error) {
        console.error('Error getting project skills with details:', error);
        return [];
    }
};
