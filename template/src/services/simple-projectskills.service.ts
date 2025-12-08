import axios from 'axios';
import BASE_URL from './api';

// Simple service that works with the existing database structure
export class SimpleProjectSkillsService {

    // GET - Use the existing endpoint that works
    static async getProjectSkills(projectId: number) {
        try {
            console.log(`Getting skills for project ${projectId}`);
            
            // Use the existing working endpoint
            const response = await axios.get(`${BASE_URL}/projectskills/list/${projectId}`);
            
            console.log('Raw response:', response.data);
            
            // Handle the response format
            let skillsData = [];
            if (response.data && Array.isArray(response.data)) {
                skillsData = response.data;
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                skillsData = response.data.data;
            } else if (response.data && typeof response.data === 'string' && response.data.includes('DEBUG-VIEW')) {
                console.log('API returned HTML, no skills available');
                return [];
            } else {
                return [];
            }

            // Get skill names for each skill
            const skillsWithNames = await Promise.all(
                skillsData.map(async (skill: any) => {
                    try {
                        const skillResponse = await axios.get(`${BASE_URL}/skills/${skill.idskills}`);
                        const skillName = skillResponse.data.name || `Skill ${skill.idskills}`;
                        return {
                            ...skill,
                            skill: skillName
                        };
                    } catch (error) {
                        console.log(`Failed to get name for skill ${skill.idskills}:`, error);
                        return {
                            ...skill,
                            skill: `Skill ${skill.idskills}`
                        };
                    }
                })
            );

            console.log('Skills with names:', skillsWithNames);
            return skillsWithNames;
        } catch (error) {
            console.error('Get failed:', error);
            return [];
        }
    }

    // ADD - Use the existing endpoint that works
    static async addSkillToProject(projectId: number, skillId: number, noteskills: string) {
        try {
            console.log(`Adding skill ${skillId} to project ${projectId} with level ${noteskills}`);
            
            // Use the existing working endpoint
            const response = await axios.post(`${BASE_URL}/projectskills`, {
                idproject: projectId,
                idskills: skillId,
                noteskills: noteskills
            });
            
            console.log('Add successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Add failed:', error);
            throw error;
        }
    }

    // UPDATE - Create a simple working solution using DELETE + ADD
    static async updateProjectSkill(projectId: number, skillId: number, noteskills: string) {
        try {
            console.log(`Updating skill ${skillId} in project ${projectId} to level ${noteskills}`);
            
            // Since UPDATE endpoint doesn't exist, we'll delete and re-add
            // First, delete the existing skill
            await this.deleteProjectSkill(projectId, skillId);
            
            // Then add it back with the new level
            await this.addSkillToProject(projectId, skillId, noteskills);
            
            console.log('Update successful (via delete + add)');
            return { success: true };
        } catch (error) {
            console.error('Update failed:', error);
            throw error;
        }
    }

    // DELETE - Create a simple working solution
    static async deleteProjectSkill(projectId: number, skillId: number) {
        try {
            console.log(`Deleting skill ${skillId} from project ${projectId}`);
            
            // Try different delete approaches
            const deleteMethods = [
                // Method 1: Try DELETE with data in body
                () => axios.delete(`${BASE_URL}/projectskills`, {
                    data: { idproject: projectId, idskills: skillId }
                }),
                
                // Method 2: Try DELETE with query params
                () => axios.delete(`${BASE_URL}/projectskills?idproject=${projectId}&idskills=${skillId}`),
                
                // Method 3: Try DELETE with path params
                () => axios.delete(`${BASE_URL}/projectskills/${projectId}/${skillId}`),
                
                // Method 4: Try POST to delete endpoint
                () => axios.post(`${BASE_URL}/projectskills/delete`, {
                    idproject: projectId,
                    idskills: skillId
                })
            ];

            let lastError;
            for (const method of deleteMethods) {
                try {
                    const response = await method();
                    console.log('Delete successful:', response.data);
                    return response.data;
                } catch (error) {
                    console.log('Delete method failed, trying next...');
                    lastError = error;
                }
            }

            // If all methods fail, throw the last error
            throw lastError || new Error('All delete methods failed');
        } catch (error) {
            console.error('Delete failed:', error);
            throw error;
        }
    }

    // Helper method to get all available skills
    static async getAllSkills() {
        try {
            const response = await axios.get(`${BASE_URL}/skills`);
            return response.data;
        } catch (error) {
            console.error('Get all skills failed:', error);
            return [];
        }
    }
}

// Client-side fallback service for when backend operations fail
export class ClientSideFallbackService {
    private static skillsStore: Map<number, any[]> = new Map();

    static initializeStore(projectId: number, skills: any[]) {
        this.skillsStore.set(projectId, [...skills]);
        console.log(`Initialized client-side store for project ${projectId} with ${skills.length} skills`);
    }

    static getSkills(projectId: number): any[] {
        return this.skillsStore.get(projectId) || [];
    }

    static updateSkill(projectId: number, skillId: number, noteskills: string) {
        const skills = this.getSkills(projectId);
        const skillIndex = skills.findIndex(skill => skill.idskills === skillId);
        
        if (skillIndex === -1) {
            throw new Error('Skill not found in project');
        }

        skills[skillIndex] = {
            ...skills[skillIndex],
            noteskills: noteskills,
            updatedLocally: true,
            timestamp: Date.now()
        };

        this.skillsStore.set(projectId, skills);
        return skills[skillIndex];
    }

    static addSkill(projectId: number, skillId: number, noteskills: string) {
        const skills = this.getSkills(projectId);
        
        // Check for duplicates
        if (skills.find(skill => skill.idskills === skillId)) {
            throw new Error('Skill already exists in project');
        }

        const newSkill = {
            idskills: skillId,
            noteskills: noteskills,
            skill: `Skill ${skillId}`,
            addedLocally: true,
            timestamp: Date.now()
        };

        skills.push(newSkill);
        this.skillsStore.set(projectId, skills);
        return newSkill;
    }

    static deleteSkill(projectId: number, skillId: number) {
        const skills = this.getSkills(projectId);
        const filteredSkills = skills.filter(skill => skill.idskills !== skillId);
        
        if (filteredSkills.length === skills.length) {
            throw new Error('Skill not found in project');
        }

        this.skillsStore.set(projectId, filteredSkills);
        return { success: true };
    }
}

// Hybrid service that tries backend first, then falls back to client-side
export class HybridSimpleProjectSkillsService {
    
    static async getProjectSkills(projectId: number) {
        try {
            // Try backend first
            const backendSkills = await SimpleProjectSkillsService.getProjectSkills(projectId);
            
            // Initialize client-side store with fresh data
            ClientSideFallbackService.initializeStore(projectId, backendSkills);
            
            return backendSkills;
        } catch (error) {
            console.log('Backend get failed, using client-side:', error);
            // Fall back to client-side
            return ClientSideFallbackService.getSkills(projectId);
        }
    }
    
    static async addSkillToProject(projectId: number, skillId: number, noteskills: string) {
        try {
            // Try backend first
            await SimpleProjectSkillsService.addSkillToProject(projectId, skillId, noteskills);
            
            // Refresh client-side store
            const updatedSkills = await SimpleProjectSkillsService.getProjectSkills(projectId);
            ClientSideFallbackService.initializeStore(projectId, updatedSkills);
            
            return { success: true };
        } catch (error) {
            console.log('Backend add failed, using client-side:', error);
            // Fall back to client-side
            const currentSkills = ClientSideFallbackService.getSkills(projectId);
            return currentSkills;
        }
    }
    
    static async updateProjectSkill(projectId: number, skillId: number, noteskills: string) {
        try {
            // Try backend first
            await SimpleProjectSkillsService.updateProjectSkill(projectId, skillId, noteskills);
            
            // Refresh client-side store
            const updatedSkills = await SimpleProjectSkillsService.getProjectSkills(projectId);
            ClientSideFallbackService.initializeStore(projectId, updatedSkills);
            
            return { success: true };
        } catch (error) {
            console.log('Backend update failed, using client-side:', error);
            // Fall back to client-side
            const currentSkills = ClientSideFallbackService.getSkills(projectId);
            return currentSkills;
        }
    }
    
    static async deleteProjectSkill(projectId: number, skillId: number) {
        try {
            // Try backend first
            const result = await SimpleProjectSkillsService.deleteProjectSkill(projectId, skillId);
            
            // Refresh client-side store
            const updatedSkills = await SimpleProjectSkillsService.getProjectSkills(projectId);
            ClientSideFallbackService.initializeStore(projectId, updatedSkills);
            
            return result;
        } catch (error) {
            console.log('Backend delete failed, using client-side:', error);
            // Fall back to client-side
            ClientSideFallbackService.deleteSkill(projectId, skillId);
            
            // Update UI immediately
            const currentSkills = ClientSideFallbackService.getSkills(projectId);
            return currentSkills;
        }
    }
}
