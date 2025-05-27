import axios from "axios";
import BASE_URL from "./api";
import { Projet } from "../types/projet";
import { getSkills } from "./Skills.service";

const getProjects = async () : Promise<Projet[]> => {

    const url = `${BASE_URL}/projects`;
    const result = await axios.get<Projet[]>(url);

    return result.data;

};

const addProject = async (formData: FormData) => {
    const url = `${BASE_URL}/projects`;

    const result = await axios.post(url, formData, {
        headers: {
            "Accept": "application/json"
        }
    });

    return result.data;
};

const updateProject = async ( skill: Projet ) => {
    const url = `${BASE_URL}/projects/${skill.id}`;
    
    const result = await axios.put(url, skill, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    return result.data;
};

const deleteProject = async ( id: number ) => {
    const url = `${BASE_URL}/projects/${id}`;
    
    const result = await axios.delete(url);

    return result.data;
};

const getDatasForDetailsForm = async () => {
    // inona no atao ato
    // asaina maka skills fotsiny izy ato
    const skills = await getSkills();

    const formData = {
        "skills" : skills
    };

    return formData;
};

const ajouterSkillProjet = async (idProjet: number, data: any) => {
    const url = `${BASE_URL}/projects/${idProjet}/add-detail-stack`;
    const result = await axios.post(url, data, {
        headers: {
            "Content-Type": "application/json"
        }
    })

    return result;
};


const getTechnologiesForProject = async (idProjet: number) => {
    const url = `${BASE_URL}/projects/${idProjet}/get-detail-stack`;
    const result = await axios.get(url);

    return result;
};

export {
    getProjects,
    addProject,
    updateProject,
    deleteProject,
    getDatasForDetailsForm,
    ajouterSkillProjet,
    getTechnologiesForProject
}