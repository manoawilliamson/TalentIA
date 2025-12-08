import axios from 'axios';
import BASE_URL from './api';

// Direct database operations for projectskills
export class DatabaseService {
    
    // CREATE - Direct database insert
    static async addProjectSkill(projectId: number, skillId: number, noteskills: string) {
        try {
            // Try to use a direct database endpoint
            const response = await axios.post(`${BASE_URL}/api/database/projectskills`, {
                action: 'INSERT',
                table: 'projectskills',
                data: {
                    idproject: projectId,
                    idskills: skillId,
                    noteskills: noteskills
                }
            });
            return response.data;
        } catch (error) {
            console.error('Direct DB insert failed:', error);
            throw error;
        }
    }

    // READ - Direct database select with JOIN
    static async getProjectSkills(projectId: number) {
        try {
            // Try direct SQL query with JOIN
            const response = await axios.post(`${BASE_URL}/api/database/query`, {
                query: `
                    SELECT ps.id, ps.idproject, ps.idskills, ps.noteskills, s.name as skill_name, s.category
                    FROM projectskills ps
                    LEFT JOIN skills s ON ps.idskills = s.id
                    WHERE ps.idproject = ?
                    ORDER BY ps.id
                `,
                params: [projectId]
            });
            
            // Transform the data to match our interface
            return response.data.map((row: any) => ({
                id: row.id,
                idproject: row.idproject,
                idskills: row.idskills,
                noteskills: row.noteskills,
                skill: {
                    id: row.idskills,
                    name: row.skill_name,
                    category: row.category
                }
            }));
        } catch (error) {
            console.error('Direct DB query failed:', error);
            throw error;
        }
    }

    // UPDATE - Direct database update
    static async updateProjectSkill(projectId: number, skillId: number, noteskills: string) {
        try {
            const response = await axios.post(`${BASE_URL}/api/database/projectskills`, {
                action: 'UPDATE',
                table: 'projectskills',
                condition: 'idproject = ? AND idskills = ?',
                params: [projectId, skillId],
                data: {
                    noteskills: noteskills
                }
            });
            return response.data;
        } catch (error) {
            console.error('Direct DB update failed:', error);
            throw error;
        }
    }

    // DELETE - Direct database delete
    static async deleteProjectSkill(projectId: number, skillId: number) {
        try {
            const response = await axios.post(`${BASE_URL}/api/database/projectskills`, {
                action: 'DELETE',
                table: 'projectskills',
                condition: 'idproject = ? AND idskills = ?',
                params: [projectId, skillId]
            });
            return response.data;
        } catch (error) {
            console.error('Direct DB delete failed:', error);
            throw error;
        }
    }

    // Alternative: Use raw SQL endpoint
    static async executeRawQuery(sql: string, params: any[] = []) {
        try {
            const response = await axios.post(`${BASE_URL}/api/database/raw`, {
                query: sql,
                params: params
            });
            return response.data;
        } catch (error) {
            console.error('Raw query failed:', error);
            throw error;
        }
    }

    // Alternative: Use existing skill endpoints with database operations
    static async getSkillsFromDatabase() {
        try {
            const response = await axios.get(`${BASE_URL}/skills`);
            return response.data;
        } catch (error) {
            console.error('Get skills failed:', error);
            throw error;
        }
    }
}

// Fallback service that tries multiple approaches
export class ProjectSkillsCRUD {
    
    // ADD with multiple fallbacks
    static async add(projectId: number, skillId: number, noteskills: string) {
        console.log(`Adding skill ${skillId} to project ${projectId} with level ${noteskills}`);
        
        // Method 1: Direct database service
        try {
            const result = await DatabaseService.addProjectSkill(projectId, skillId, noteskills);
            console.log('Direct DB add success:', result);
            return result;
        } catch (error) {
            console.log('Direct DB add failed, trying Method 2');
        }

        // Method 2: Raw SQL query
        try {
            const sql = `INSERT INTO projectskills (idproject, idskills, noteskills) VALUES (?, ?, ?)`;
            const result = await DatabaseService.executeRawQuery(sql, [projectId, skillId, noteskills]);
            console.log('Raw SQL add success:', result);
            return result;
        } catch (error) {
            console.log('Raw SQL add failed, trying Method 3');
        }

        // Method 3: Use existing project service
        try {
            const response = await axios.post(`${BASE_URL}/projectskills`, {
                idproject: projectId,
                idskills: skillId,
                noteskills: noteskills
            });
            console.log('Project service add success:', response.data);
            return response.data;
        } catch (error) {
            console.log('Project service add failed, trying Method 4');
        }

        // Method 4: Try different endpoint patterns
        const endpoints = [
            `${BASE_URL}/api/projectskills/add`,
            `${BASE_URL}/projectskills/add`,
            `${BASE_URL}/api/projectskills/insert`,
            `${BASE_URL}/projectskills/insert`
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await axios.post(endpoint, {
                    idproject: projectId,
                    idskills: skillId,
                    noteskills: noteskills
                });
                console.log(`Add success with ${endpoint}:`, response.data);
                return response.data;
            } catch (error) {
                continue;
            }
        }

        throw new Error('All add methods failed');
    }

    // GET with multiple fallbacks
    static async getAll(projectId: number) {
        console.log(`Getting skills for project ${projectId}`);
        
        // Method 1: Direct database service with JOIN
        try {
            const result = await DatabaseService.getProjectSkills(projectId);
            console.log('Direct DB get success:', result);
            return result;
        } catch (error) {
            console.log('Direct DB get failed, trying Method 2');
        }

        // Method 2: Raw SQL query
        try {
            const sql = `
                SELECT ps.id, ps.idproject, ps.idskills, ps.noteskills, s.name as skill_name, s.category
                FROM projectskills ps
                LEFT JOIN skills s ON ps.idskills = s.id
                WHERE ps.idproject = ?
                ORDER BY ps.id
            `;
            const result = await DatabaseService.executeRawQuery(sql, [projectId]);
            console.log('Raw SQL get success:', result);
            
            // Transform data
            return result.map((row: any) => ({
                id: row.id,
                idproject: row.idproject,
                idskills: row.idskills,
                noteskills: row.noteskills,
                skill: row.skill_name ? {
                    id: row.idskills,
                    name: row.skill_name,
                    category: row.category
                } : undefined
            }));
        } catch (error) {
            console.log('Raw SQL get failed, trying Method 3');
        }

        // Method 3: Try existing endpoints
        const endpoints = [
            `${BASE_URL}/projectskills/project/${projectId}`,
            `${BASE_URL}/api/projectskills/project/${projectId}`,
            `${BASE_URL}/projectskills/list/${projectId}`,
            `${BASE_URL}/api/projectskills/list/${projectId}`
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(endpoint);
                if (response.data && !response.data.toString().includes('DEBUG-VIEW')) {
                    console.log(`Get success with ${endpoint}:`, response.data);
                    return response.data;
                }
            } catch (error) {
                continue;
            }
        }

        throw new Error('All get methods failed');
    }

    // UPDATE with multiple fallbacks
    static async update(projectId: number, skillId: number, noteskills: string) {
        console.log(`Updating skill ${skillId} in project ${projectId} to level ${noteskills}`);
        
        // Method 1: Direct database service
        try {
            const result = await DatabaseService.updateProjectSkill(projectId, skillId, noteskills);
            console.log('Direct DB update success:', result);
            return result;
        } catch (error) {
            console.log('Direct DB update failed, trying Method 2');
        }

        // Method 2: Raw SQL query
        try {
            const sql = `UPDATE projectskills SET noteskills = ? WHERE idproject = ? AND idskills = ?`;
            const result = await DatabaseService.executeRawQuery(sql, [noteskills, projectId, skillId]);
            console.log('Raw SQL update success:', result);
            return result;
        } catch (error) {
            console.log('Raw SQL update failed, trying Method 3');
        }

        // Method 3: Try existing endpoints
        const endpoints = [
            `${BASE_URL}/projectskills/${projectId}/${skillId}`,
            `${BASE_URL}/api/projectskills/${projectId}/${skillId}`,
            `${BASE_URL}/projectskills/update/${projectId}/${skillId}`,
            `${BASE_URL}/api/projectskills/update/${projectId}/${skillId}`
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await axios.put(endpoint, { noteskills });
                console.log(`Update success with ${endpoint}:`, response.data);
                return response.data;
            } catch (error) {
                continue;
            }
        }

        throw new Error('All update methods failed');
    }

    // DELETE with multiple fallbacks
    static async delete(projectId: number, skillId: number) {
        console.log(`Deleting skill ${skillId} from project ${projectId}`);
        
        // Method 1: Direct database service
        try {
            const result = await DatabaseService.deleteProjectSkill(projectId, skillId);
            console.log('Direct DB delete success:', result);
            return result;
        } catch (error) {
            console.log('Direct DB delete failed, trying Method 2');
        }

        // Method 2: Raw SQL query
        try {
            const sql = `DELETE FROM projectskills WHERE idproject = ? AND idskills = ?`;
            const result = await DatabaseService.executeRawQuery(sql, [projectId, skillId]);
            console.log('Raw SQL delete success:', result);
            return result;
        } catch (error) {
            console.log('Raw SQL delete failed, trying Method 3');
        }

        // Method 3: Try existing endpoints
        const endpoints = [
            `${BASE_URL}/projectskills/${projectId}/${skillId}`,
            `${BASE_URL}/api/projectskills/${projectId}/${skillId}`,
            `${BASE_URL}/projectskills/delete/${projectId}/${skillId}`,
            `${BASE_URL}/api/projectskills/delete/${projectId}/${skillId}`
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await axios.delete(endpoint);
                console.log(`Delete success with ${endpoint}:`, response.data);
                return response.data;
            } catch (error) {
                continue;
            }
        }

        throw new Error('All delete methods failed');
    }
}
