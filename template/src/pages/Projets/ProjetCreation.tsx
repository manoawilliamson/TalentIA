// ...existing imports...
import React, { useEffect, useState } from "react";
import { addProject, updateProject } from "../../services/projects.service";
import { Projet } from "../../types/projet";

interface ProjetCreationProps {
    reloadTrigger: any;
    toUpdateData?: Projet | null;
    reload: boolean;
    isUpdate?: boolean;
}

const ProjetCreation = ({ reloadTrigger, toUpdateData, reload = false, isUpdate = false }: ProjetCreationProps) => {
    const actionName: string = !isUpdate ? "Ajouter" : "Modifier";
    const [projet, setProjet] = useState<Projet>(
        toUpdateData != null
            ? toUpdateData
            : {
                  id: undefined,
                  name: "",
                  description: "",
                  datebegin: "",
                  dateend: "",
                  nbrperson: undefined,
                  remark: "",
                  file: undefined,
              }
    );
    const [loading, isLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProjet({
            ...projet,
            [name]: value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const submitProjet = async (event: React.MouseEvent) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(projet).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string);
        }
    });
    if (file) {
        formData.append("file", file);
    }
    try {
        await addProject(formData);
        reloadTrigger();
    } catch (error) {
        alert("Erreur lors de l'ajout du projet");
    }
};

    const updateProjet = async (event: React.MouseEvent) => {
        event.preventDefault();
        const formData = new FormData();
        Object.entries(projet).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });
        if (file) {
            formData.append("file", file);
        }
        await updateProject(formData);
        reloadTrigger();
    };

    const performAction = async (event: React.MouseEvent) => {
        if (!isUpdate) {
            submitProjet(event);
        } else {
            updateProjet(event);
        }
    };

    useEffect(() => {
        if (toUpdateData != null) {
            isLoading(true);
            setProjet(toUpdateData);
            isLoading(false);
        }
    }, [reload, toUpdateData]);

    return (
        !loading && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Les Projets</h3>
                </div>
                <div>
                    <div className="p-6.5">
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">Nom du projet</label>
                            <input
                                name="name"
                                onChange={handleChange}
                                type="text"
                                placeholder="Project Name"
                                value={projet.name}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">Description du projet</label>
                            <textarea
                                name="description"
                                onChange={handleChange}
                                value={projet.description}
                                placeholder="Description projet"
                                rows={5}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">Date begin</label>
                            <input
                                name="datebegin"
                                onChange={handleChange}
                                type="date"
                                value={projet.datebegin || ""}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">Date end</label>
                            <input
                                name="dateend"
                                onChange={handleChange}
                                type="date"
                                value={projet.dateend || ""}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">Number person</label>
                            <input
                                name="nbrperson"
                                onChange={handleChange}
                                type="number"
                                value={projet.nbrperson || ""}
                                placeholder="Nombre de personnes"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">Remark</label>
                            <textarea
                                name="remark"
                                onChange={handleChange}
                                value={projet.remark}
                                placeholder="Remarque"
                                rows={3}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">File</label>
                            <input
                                name="file"
                                onChange={handleFileChange}
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={performAction}
                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                        >
                            {actionName}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ProjetCreation;