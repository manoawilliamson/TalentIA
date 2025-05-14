import axios from "axios";
import type { Skill } from "../types/skill";
import BASE_URL from "./api";

const getSkills = async () : Promise<Skill[]> => {

    const url = `${BASE_URL}/skills`;

    const result = await axios.get<Skill[]>(url);

    return result.data;

};

const addSkill = async ( skill: Skill ) => {
    const url = `${BASE_URL}/skills`;
    
    const result = await axios.post(url, skill, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    return result.data;
};


const updateSkill = async ( skill: Skill ) => {
    const url = `${BASE_URL}/skills/${skill.id}`;
    
    const result = await axios.put(url, skill, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    return result.data;
};

const deleteSkill = async ( id: number ) => {
    const url = `${BASE_URL}/skills/${id}`;
    
    const result = await axios.delete(url);

    return result.data;
};

export {
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill
}