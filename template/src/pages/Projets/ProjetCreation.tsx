import { useEffect, useState } from "react";
import { addSkill, updateSkill } from "../../services/Skills.service";
import { Projet } from "../../types/projet";
import { addProject, updateProject } from "../../services/projects.service";

interface ProjetCreationProps {
    reloadTrigger: any;
    toUpdateData?: Projet | null;
    reload: boolean;
    isUpdate?: boolean;
}


const ProjetCreation = ( {reloadTrigger, toUpdateData, reload=false, isUpdate=false}: ProjetCreationProps ) => {

    const actionName : string = (!isUpdate) ? "Ajouter" : "Modifier";
    const[skill, setSkill] = useState<Projet>( (toUpdateData != null) ? toUpdateData : {
        id: undefined,
        name: '',
        description: ''
    });

    const [loading, isLoading] = useState<boolean>(false);

    const handleNameChange = ( value: string ) => {
        setSkill({
            ...skill,
            name: value
        })
    };

    const handleCategoryChange = ( value: string ) => {
        setSkill({
            ...skill,
            description: value
        })
    };

    const submitSkill = async (event: React.MouseEvent) => {
        event.preventDefault();
        await addProject(skill);
        reloadTrigger();
    };

    const updateSkills = async (event: React.MouseEvent) => {
        event.preventDefault();
        await updateProject(skill);
        reloadTrigger();
    };

    const performAction = async (event: React.MouseEvent) => {
        if( !isUpdate ){
            submitSkill(event);
        }else{
            updateSkills(event);
        }
    };

    useEffect(() => {
        if( toUpdateData != null ){
            isLoading(true);
            setSkill(toUpdateData);
            isLoading(false);
        }
    }, [reload]);


    return (
        !loading &&
        <>
            
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Les Projets
                </h3>
              </div>
              <div >
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nom du projet
                    </label>
                    <input
                      onChange={(event) => handleNameChange(event.target.value)}
                      type="text"
                      placeholder="Project Name"
                      value={skill.name}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
  
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Description du projet
                    </label>
                    <input
                      onChange={(event) => handleCategoryChange(event.target.value)}
                      type="text"
                      value={skill.description}
                      placeholder="Description projet"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
  
                  <button 
                    type="button"
                    onClick={(event) => performAction(event)}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    { actionName }
                  </button>
                </div>
              </div>
            </div>
        
      </>

    )
};


export default ProjetCreation;