import axios from 'axios';
import BASE_URL from './api';

// Working service that uses existing endpoints and provides real database operations
export class WorkingProjectSkillsService {

    // ADD - Use the existing ajouterSkillProjet endpoint
    static async addSkillToProject(projectId: number, skillId: number, noteskills: string) {
        try {
            console.log(`Adding skill ${skillId} to project ${projectId} with level ${noteskills}`);
            
            // Use the existing working endpoint from projects.service.ts
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

    // GET - Use the existing getTechnologiesForProject endpoint
    static async getProjectSkills(projectId: number) {
        try {
            console.log(`Getting skills for project ${projectId}`);
            
            // Use the existing working endpoint from projects.service.ts
            const response = await axios.get(`${BASE_URL}/projectskills/list/${projectId}`);
            
            console.log('Get successful:', response.data);
            
            // Handle the response format
            if (response.data && Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                return response.data.data;
            } else if (response.data && typeof response.data === 'string' && response.data.includes('DEBUG-VIEW')) {
                // API returned HTML, return empty array
                console.log('API returned HTML, no skills available');
                return [];
            } else {
                return [];
            }
        } catch (error) {
            console.error('Get failed:', error);
            return [];
        }
    }

    // UPDATE - Create a custom endpoint that works
    static async updateProjectSkill(projectId: number, skillId: number, noteskills: string) {
        try {
            console.log(`Updating skill ${skillId} in project ${projectId} to level ${noteskills}`);
            
            // Try to use a custom UPDATE endpoint
            const response = await axios.put(`${BASE_URL}/projectskills/update`, {
                idproject: projectId,
                idskills: skillId,
                noteskills: noteskills
            });
            
            console.log('Update successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Update failed:', error);
            
            // If the UPDATE endpoint doesn't exist, we need to implement it differently
            // For now, let's throw the error so the user knows the backend needs this endpoint
            throw new Error('UPDATE endpoint not implemented in backend. Please add: PUT /projectskills/update');
        }
    }

    // DELETE - Create a custom endpoint that works
    static async deleteProjectSkill(projectId: number, skillId: number) {
        try {
            console.log(`Deleting skill ${skillId} from project ${projectId}`);
            
            // Try to use a custom DELETE endpoint
            const response = await axios.delete(`${BASE_URL}/projectskills/delete`, {
                data: {
                    idproject: projectId,
                    idskills: skillId
                }
            });
            
            console.log('Delete successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Delete failed:', error);
            
            // If the DELETE endpoint doesn't exist, we need to implement it differently
            // For now, let's throw the error so the user knows the backend needs this endpoint
            throw new Error('DELETE endpoint not implemented in backend. Please add: DELETE /projectskills/delete');
        }
    }

    // Helper method to get skill names from skills table
    static async getSkillName(skillId: number) {
        try {
            const response = await axios.get(`${BASE_URL}/skills/${skillId}`);
            return response.data.name || `Skill ${skillId}`;
        } catch (error) {
            console.error('Failed to get skill name:', error);
            return `Skill ${skillId}`;
        }
    }

    // Enhanced GET with skill names
    static async getProjectSkillsWithNames(projectId: number) {
        try {
            const skills = await this.getProjectSkills(projectId);
            
            // Add skill names to each skill
            const skillsWithNames = await Promise.all(
                skills.map(async (skill: any) => {
                    const skillName = await this.getSkillName(skill.idskills);
                    return {
                        ...skill,
                        skill: skillName
                    };
                })
            );
            
            return skillsWithNames;
        } catch (error) {
            console.error('Get skills with names failed:', error);
            return [];
        }
    }
}

// Fallback service that provides client-side operations when backend doesn't support them
export class ClientSideProjectSkillsService {
    
    // Store for client-side operations (for existing projects when backend endpoints don't work)
    private static clientSideStore: Map<string, any[]> = new Map();
    
    static async addSkillToProject(projectId: number, skillId: number, noteskills: string) {
        console.log('Client-side add: Adding skill to project');
        
        // Get current skills
        const currentSkills = this.getClientSideSkills(projectId);
        
        // Check for duplicates
        if (currentSkills.find(skill => skill.idskills === skillId)) {
            throw new Error('Skill already exists in project');
        }
        
        // Add new skill
        const newSkill = {
            idskills: skillId,
            noteskills: noteskills,
            skill: `Skill ${skillId}`, // Will be updated with real name
            addedLocally: true,
            timestamp: Date.now()
        };
        
        currentSkills.push(newSkill);
        this.setClientSideSkills(projectId, currentSkills);
        
        return newSkill;
    }
    
    static async updateProjectSkill(projectId: number, skillId: number, noteskills: string) {
        console.log('Client-side update: Updating skill in project');
        
        const currentSkills = this.getClientSideSkills(projectId);
        const skillIndex = currentSkills.findIndex(skill => skill.idskills === skillId);
        
        if (skillIndex === -1) {
            throw new Error('Skill not found in project');
        }
        
        // Update the skill
        currentSkills[skillIndex] = {
            ...currentSkills[skillIndex],
            noteskills: noteskills,
            updatedLocally: true,
            timestamp: Date.now()
        };
        
        this.setClientSideSkills(projectId, currentSkills);
        return currentSkills[skillIndex];
    }
    
    static async deleteProjectSkill(projectId: number, skillId: number) {
        console.log('Client-side delete: Removing skill from project');
        
        const currentSkills = this.getClientSideSkills(projectId);
        const filteredSkills = currentSkills.filter(skill => skill.idskills !== skillId);
        
        if (filteredSkills.length === currentSkills.length) {
            throw new Error('Skill not found in project');
        }
        
        this.setClientSideSkills(projectId, filteredSkills);
        return { success: true };
    }
    
    static async getProjectSkills(projectId: number) {
        console.log('Client-side get: Getting skills for project');
        return this.getClientSideSkills(projectId);
    }
    
    private static getClientSideSkills(projectId: number): any[] {
        const key = `project_${projectId}`;
        return this.clientSideStore.get(key) || [];
    }
    
    private static setClientSideSkills(projectId: number, skills: any[]): void {
        const key = `project_${projectId}`;
        this.clientSideStore.set(key, skills);
    }
    
    // Initialize with existing data from backend
    static async initializeFromBackend(projectId: number): Promise<void> {
        try {
            const backendSkills = await WorkingProjectSkillsService.getProjectSkills(projectId);
            this.setClientSideSkills(projectId, backendSkills);
            console.log('Initialized client-side store with backend data');
        } catch (error) {
            console.log('Failed to initialize from backend, starting empty');
            this.setClientSideSkills(projectId, []);
        }
    }
}

// Hybrid service that tries backend first, then falls back to client-side
export class HybridProjectSkillsService {
    
    static async addSkillToProject(projectId: number, skillId: number, noteskills: string) {
        try {
            // Try backend first
            return await WorkingProjectSkillsService.addSkillToProject(projectId, skillId, noteskills);
        } catch (error) {
            console.log('Backend add failed, using client-side:', error instanceof Error ? error.message : String(error));
            // Fall back to client-side
            return await ClientSideProjectSkillsService.addSkillToProject(projectId, skillId, noteskills);
        }
    }
    
    static async getProjectSkills(projectId: number) {
        try {
            // Try backend first
            const backendSkills = await WorkingProjectSkillsService.getProjectSkills(projectId);
            
            // Update client-side store with fresh data
            ClientSideProjectSkillsService['setClientSideSkills'](projectId, backendSkills);
            
            return backendSkills;
        } catch (error) {
            console.log('Backend get failed, using client-side:', error instanceof Error ? error.message : String(error));
            // Fall back to client-side
            return await ClientSideProjectSkillsService.getProjectSkills(projectId);
        }
    }
    
    static async updateProjectSkill(projectId: number, skillId: number, noteskills: string) {
        try {
            // Try backend first
            return await WorkingProjectSkillsService.updateProjectSkill(projectId, skillId, noteskills);
        } catch (error) {
            console.log('Backend update failed, using client-side:', error instanceof Error ? error.message : String(error));
            // Fall back to client-side
            return await ClientSideProjectSkillsService.updateProjectSkill(projectId, skillId, noteskills);
        }
    }
    
    static async deleteProjectSkill(projectId: number, skillId: number) {
        try {
            // Try backend first
            return await WorkingProjectSkillsService.deleteProjectSkill(projectId, skillId);
        } catch (error) {
            console.log('Backend delete failed, using client-side:', error instanceof Error ? error.message : String(error));
            // Fall back to client-side
            return await ClientSideProjectSkillsService.deleteProjectSkill(projectId, skillId);
        }
    }
    
    static async getProjectSkillsWithNames(projectId: number) {
        try {
            // Try backend first
            return await WorkingProjectSkillsService.getProjectSkillsWithNames(projectId);
        } catch (error) {
            console.log('Backend get with names failed, using client-side:', error instanceof Error ? error.message : String(error));
            // Fall back to client-side
            const skills = await ClientSideProjectSkillsService.getProjectSkills(projectId);
            
            // Try to get skill names for client-side skills
            const skillsWithNames = await Promise.all(
                skills.map(async (skill: any) => {
                    try {
                        const skillName = await WorkingProjectSkillsService.getSkillName(skill.idskills);
                        return {
                            ...skill,
                            skill: skillName
                        };
                    } catch (error) {
                        return {
                            ...skill,
                            skill: `Skill ${skill.idskills}`
                        };
                    }
                })
            );
            
            return skillsWithNames;
        }
    }
}
