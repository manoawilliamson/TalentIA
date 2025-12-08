import axios from "axios";
import BASE_URL from "./api";

export interface PersonSkill {
    id: number;
    idperson: number;
    idskill: number;
    skill?: string;
    noteskill: number;
    dateupdate?: string;
}

const getPersonSkills = async (personId: number): Promise<PersonSkill[]> => {
    const url = `${BASE_URL}/personskills/${personId}`;
    const result = await axios.get(url);
    return result.data.personskills || [];
};

const addPersonSkill = async (personId: number, skillId: number, rating: number) => {
    const url = `${BASE_URL}/personskills`;
    const result = await axios.post(url, {
        idperson: personId,
        idskills: skillId,
        noteskills: rating
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return result.data;
};

const updatePersonSkill = async (id: number, personId: number, skillId: number, rating: number) => {
    const url = `${BASE_URL}/personskills/${id}`;
    const result = await axios.put(url, {
        idperson: personId,
        idskill: skillId,
        noteskill: rating
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return result.data;
};

// Alternative update function that uses person and skill IDs
const updatePersonSkillByPersonAndSkill = async (personId: number, skillId: number, rating: number) => {
    const url = `${BASE_URL}/personskills/person/${personId}/skill/${skillId}`;
    const result = await axios.put(url, {
        noteskill: rating
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return result.data;
};

const deletePersonSkill = async (id: number) => {
    const url = `${BASE_URL}/personskills/${id}`;
    const result = await axios.delete(url);
    return result.data;
};

export {
    getPersonSkills,
    addPersonSkill,
    updatePersonSkill,
    updatePersonSkillByPersonAndSkill,
    deletePersonSkill
};
