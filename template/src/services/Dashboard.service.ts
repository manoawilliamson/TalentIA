import axios from 'axios';
import BASE_URL from './api';


interface SkillUtilisation {
    id: number;
    nomskill: string;
    nbutilisation: number;
}

const getStats = async () : Promise<SkillUtilisation[]> => {
    const url = BASE_URL + "/stats/user_skills";
    const result = await axios.get<SkillUtilisation[]>(url);
    const data = result.data;
    return data;
};

export {
    getStats
};
export type { SkillUtilisation };
