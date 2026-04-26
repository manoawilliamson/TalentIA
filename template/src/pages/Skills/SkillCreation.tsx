import { useEffect, useState } from "react";
import { FaCode, FaSave } from "react-icons/fa";
import { Skill } from "../../types/skill";
import { addSkill, updateSkill } from "../../services/Skills.service";

interface SkillCreationProps {
    reloadTrigger: any;
    toUpdateData?: Skill | null;
    reload: boolean;
    isUpdate?: boolean;
}

const SkillCreation = ({ reloadTrigger, toUpdateData, reload = false, isUpdate = false }: SkillCreationProps) => {
    const actionName: string = (!isUpdate) ? "Ajouter" : "Modifier";
    const [skill, setSkill] = useState<Skill>((toUpdateData != null) ? toUpdateData : {
        id: undefined,
        name: '',
        category: ''
    });

    const [loading, isLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleNameChange = (value: string) => {
        setSkill({
            ...skill,
            name: value
        })
    };

    const handleCategoryChange = (value: string) => {
        setSkill({
            ...skill,
            category: value
        })
    };

    const submitSkill = async (event: React.MouseEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        isLoading(true);
        try {
            await addSkill(skill);
            setSuccess("Compétence ajoutée avec succès !");
            setTimeout(() => {
                reloadTrigger();
                setSuccess(null);
            }, 1500);
        } catch (err: any) {
            console.error("Error adding skill:", err);
            const message = err.response?.data?.error || "Une erreur est survenue lors de l'ajout.";
            setError(message);
        } finally {
            isLoading(false);
        }
    };

    const updateSkills = async (event: React.MouseEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        isLoading(true);
        try {
            await updateSkill(skill);
            setSuccess("Compétence mise à jour avec succès !");
            setTimeout(() => {
                reloadTrigger();
                setSuccess(null);
            }, 1500);
        } catch (err: any) {
            console.error("Error updating skill:", err);
            const message = err.response?.data?.error || "Une erreur est survenue lors de la mise à jour.";
            setError(message);
        } finally {
            isLoading(false);
        }
    };

    const performAction = async (event: React.MouseEvent) => {
        if (!isUpdate) {
            submitSkill(event);
        } else {
            updateSkills(event);
        }
    };

    useEffect(() => {
        if (toUpdateData != null) {
            isLoading(true);
            setSkill(toUpdateData);
            isLoading(false);
        }
    }, [reload]);

    return (
        !loading &&
        <>
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaCode className="text-blue-600 text-sm" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {actionName} une Compétence
                    </h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de la compétence
                        </label>
                        <input
                            onChange={(event) => handleNameChange(event.target.value)}
                            type="text"
                            placeholder="Ex: JavaScript, React, Node.js..."
                            value={skill.name}
                            className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie
                        </label>
                        <input
                            onChange={(event) => handleCategoryChange(event.target.value)}
                            type="text"
                            value={skill.category}
                            placeholder="Ex: Frontend, Backend, DevOps..."
                            className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-sm animate-shake">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-100 border border-green-200 text-green-700 rounded-xl text-sm">
                            {success}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={(event) => performAction(event)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Traitement...
                            </div>
                        ) : (
                            <>
                                <FaSave className="text-sm" />
                                {actionName}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
};

export default SkillCreation;