import { useEffect, useState } from "react";
import { Projet } from "../../types/projet";
import { deleteProject, getProjects } from "../../services/projects.service";
import FicheProjet from "./FicheProjet";
import { useNavigate } from 'react-router-dom';

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
            const res = await fetch(`http://localhost:8080/api/projects/detail/${id}`, {
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
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Les Projets
                </h4>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">#</p>
                </div>
                <div className="col-span-3 hidden items-center sm:flex">
                    <p className="font-medium">Name</p>
                </div>
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">Description</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium"></p>
                </div>
            </div>

            {!isLoading && data.map((product, key) => (
                <div
                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 cursor-pointer hover:bg-gray-100"
                    key={key}
                    onClick={() => openFicheModal(product.id)}
                >
                    <div className="col-span-1 flex items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <p className="text-sm text-yellow-500">{product.id}</p>
                        </div>
                    </div>
                    <div className="col-span-3 hidden items-center sm:flex">
                        <p className="text-sm text-black dark:text-white">
                            {product.name}
                        </p>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                            {product.description}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center" onClick={e => { e.stopPropagation(); deleteSkills(product.id); }}>
                        <i className="text-sm cursor-pointer">
                            <svg
                                width="25px" height="25px" className="fill-red-500" viewBox="0 0 24 24" color="red" fill="red" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    color="red"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729"
                                />
                            </svg>
                        </i>
                    </div>
                </div>
            ))}

            {/* Modal pour la fiche projet */}
            {modalOpen && ficheData && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
                    <div
                        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative border-2 border-gray-400 box-border"
                        style={{ maxHeight: "90vh", overflowY: "auto" }}
                    >
                        <button
                            className="absolute top-2 right-2 text-xl"
                            onClick={() => setModalOpen(false)}
                        >×</button>
                        <FicheProjet data={ficheData} />
                    </div>
                </div>
            )} </div>
    );
};

export default ProjetList;