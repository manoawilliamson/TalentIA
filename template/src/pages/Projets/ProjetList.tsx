import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaFolder, FaTimes } from 'react-icons/fa';
import { Projet } from "../../types/projet";
import { deleteProject, getProjects } from "../../services/projects.service";
import FicheProjet from "./FicheProjet";
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../services/api';

interface ProjetListProps {
    reload: boolean;
    enableUpdate?: any;
}

const ProjetList = ({ reload, enableUpdate }: ProjetListProps) => {
    const [data, setData] = useState<Projet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [ficheData, setFicheData] = useState<any>(null);
    const navigate = useNavigate();

    const updateSkill = (key: any) => {
        const skill: Projet | undefined = data.find(skills => skills.id === key);
        enableUpdate(skill);
    };

    const deleteSkills = async (id: number | undefined) => {
        if (id == undefined) return;
        setIsLoading(true);
        await deleteProject(id);
        const newData = data.filter(data => data.id !== id);
        setData(newData);
        setIsLoading(false);
    };

    // Fonction pour ouvrir le modal et charger les détails du projet
    const openFicheModal = async (id: number) => {
        try {
            const res = await fetch(`${BASE_URL}/projects/detail/${id}`, {
                headers: { Accept: "application/json" }
            });
            const json = await res.json();
            setFicheData(json);
            setModalOpen(true);
        } catch (e) {
            alert("Erreur lors du chargement du projet");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const response = await getProjects();
            setData(response.projects);
            setIsLoading(false);
        };
        fetchData();
    }, [reload]);

    useEffect(() => {
        return () => {
            setIsLoading(false);
        }
    }, [isLoading]);

    return (
        <div className="rounded-2xl shadow-2xl animate-fade-in">
            <div className="py-6 px-4 md:px-6 xl:px-7.5 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-bold text-white">
                        Les Projets
                    </h4>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <i className="fas fa-project-diagram text-white"></i>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaFolder className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-400">Aucun projet trouvé</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Table Header */}
                        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-700/50 rounded-xl">
                            <div className="col-span-1 flex items-center">
                                <p className="font-semibold text-gray-300 text-sm uppercase tracking-wider">#</p>
                            </div>
                            <div className="col-span-3 hidden items-center sm:flex">
                                <p className="font-semibold text-gray-300 text-sm uppercase tracking-wider">Nom</p>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p className="font-semibold text-gray-300 text-sm uppercase tracking-wider">Description</p>
                            </div>
                            <div className="col-span-1 flex items-center justify-center">
                                <p className="font-semibold text-gray-300 text-sm uppercase tracking-wider">Actions</p>
                            </div>
                        </div>

                        {/* Table Body */}
                        {data.map((product, key) => (
                            <div
                                className="grid grid-cols-6 gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 group cursor-pointer transform hover:scale-[1.01]"
                                key={key}
                                onClick={() => openFicheModal(product.id)}
                            >
                                <div className="col-span-1 flex items-center">
                                    <span className="text-white font-bold text-sm bg-gray-600/50 px-2 py-1 rounded">
                                        #{product.id}
                                    </span>
                                </div>
                                <div className="col-span-3 hidden items-center sm:flex">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-600/50 rounded-lg flex items-center justify-center">
                                            <FaFolder className="text-blue-400 text-lg" />
                                        </div>
                                        <p className="text-white font-medium">
                                            {product.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <p className="text-gray-300 text-sm line-clamp-2">
                                        {product.description}
                                    </p>
                                </div>
                                <div className="col-span-1 flex items-center justify-center gap-2" onClick={e => { e.stopPropagation(); }}>
                                    <button
                                        className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors group"
                                        onClick={() => openFicheModal(product.id)}
                                        title="Voir les détails"
                                    >
                                        <FaEye className="text-blue-400 text-sm" />
                                    </button>
                                    <button
                                        className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors group"
                                        onClick={() => deleteSkills(product.id)}
                                        title="Supprimer"
                                    >
                                        <FaTrash className="text-red-400 text-sm" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal pour la fiche projet */}
            {modalOpen && ficheData && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div
                        className="dark-card rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative border border-gray-700"
                        style={{ maxHeight: "90vh", overflowY: "auto" }}
                    >
                        <button
                            className="absolute top-4 right-4 w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center hover:bg-gray-700/70 transition-colors text-gray-400 hover:text-white"
                            onClick={() => setModalOpen(false)}
                        >
                            <FaTimes className="text-sm" />
                        </button>
                        <FicheProjet data={ficheData} />
                    </div>
                </div>
            )} </div>
    );
};

export default ProjetList;