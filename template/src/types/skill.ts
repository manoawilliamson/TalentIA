interface Skill {
    
    id?: number;
    name: string;
    category: string;

};

interface SkillProject extends Skill {
    required_level: string;
    descriptions: string;
    effectif: number;
}

export type {Skill, SkillProject};