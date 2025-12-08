import axios from "axios";
import BASE_URL from "./api";

export interface RecommendedPerson {
    idperson: number;
    name: string;
    firstname: string;
    matching_score: number;
    total_required_skills: number;
    matched_skills: number;
}

export interface RecommendedProject {
    idproject: number;
    project_name: string;
    matching_score: number;
    total_required_skills: number;
    matched_skills: number;
}

export interface ProjectAlert {
    idproject: number;
    project_name: string;
    idskill: number;
    skill_name: string;
    required_level: number;
    alert_type: string;
}

const getRecommendationsForProject = async (projectId: number): Promise<RecommendedPerson[]> => {
    const url = `${BASE_URL}/recommendations/project/${projectId}`;
    const result = await axios.get<RecommendedPerson[]>(url);
    return result.data;
};

const getRecommendationsForPerson = async (personId: number): Promise<RecommendedProject[]> => {
    const url = `${BASE_URL}/recommendations/person/${personId}`;
    const result = await axios.get<RecommendedProject[]>(url);
    return result.data;
};

const getProjectAlerts = async (projectId: number): Promise<ProjectAlert[]> => {
    const url = `${BASE_URL}/recommendations/project-alerts/${projectId}`;
    const result = await axios.get<ProjectAlert[]>(url);
    return result.data;
};

export {
    getRecommendationsForProject,
    getRecommendationsForPerson,
    getProjectAlerts
};
