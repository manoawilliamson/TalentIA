// modal for adding techstack

import { ChangeEvent, useEffect, useState } from 'react';
import { ajouterSkillProjet, getDatasForDetailsForm, getTechnologiesForProject } from '../../services/projects.service';
import { Skill, SkillProject } from '../../types/skill';

interface ModalProps {
  openModal?: boolean;
  closeModal?: any;
  onSubmit?: any;
  toggleModal? : any;
}

interface FormStackInterface {
  skills : Skill[];
}

interface FormControlInterface {
  skill_id: number;
  required_level: string;
  effectif: number;
  descriptions: string;
}



const AddTechStack = ({ openModal, closeModal, onSubmit }: ModalProps) => {

  const [formDataDetails, setFormDataDetails] = useState<FormStackInterface>({
    skills: []
  });
  const [isOpen, setIsOpen] = useState(openModal);
  const [loading, isLoading] = useState(false);

  const[formState, setFormState] = useState<FormControlInterface>({
    skill_id: -1,
    required_level: '',
    effectif: 0,
    descriptions: ''
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = event.target;

    setFormState((prevstate) => ({
      ...prevstate,
      [name] : value
    }));
  }

  const ajouterTechnologies = async () => {
    const axiosResult = await ajouterSkillProjet(3, formState);
    if( axiosResult.status != 200 ){
      alert(axiosResult.status);
      return;
    }

    const skill = formDataDetails.skills.filter( (skill :Skill) => skill.id === formState.skill_id)[0];

    const skillProject : SkillProject = {
      descriptions: formState.descriptions,
      effectif: formState.effectif,
      required_level: formState.required_level,
      name: skill.name,
      category: skill.category
    };

    onSubmit( skillProject );
    closeModal();
  };

  useEffect(() => {

    let isMounted = true;
    if( openModal == false ) return ;

      (async function(){
        try {
          isLoading(true);
          const datas = await getDatasForDetailsForm();
          console.log(datas);
          if( isMounted ) setFormDataDetails(datas);
        } catch (error) {
          alert(error);
        }finally{
          if(isMounted) isLoading(false);
        }
      })();

      return () => {
        isMounted = false;
      }
  }, [openModal]);

  return (
    openModal &&  !loading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          {/* Close Button (Top-Right) */}
          {/* Modal Content */}
          <div> 
            <div className="modal-header">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Poste
                  </label>
                  <select
                    onChange={handleChange}
                    id="category"
                    name='skill_id'
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    {
                        openModal && !loading && formDataDetails.skills?.map( (skill: Skill) => {
                          return (<option value={skill.id}> { skill.name } </option>)
                        })
                    }
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Niveau Requis
                  </label>
                  <select
                    id="category"
                    name='required_level'
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    defaultValue={formState.required_level}
                    onChange={handleChange}
                  >
                    <option>Selectionnez Niveau</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Effectif(s) requis
                  </label>
                  <input
                    type="number"
                    name="effectif"
                    id="price"
                    min={0}
                    value={ formState.effectif }
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Autres précisions
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    name='descriptions'
                    value={formState.descriptions}
                    onChange={handleChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Autre remarques "
                  ></textarea>
                </div>
              </div>
              <button
                type='button'
                onClick={ajouterTechnologies}
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Ajouter Technologies au projet
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

const TechStack = () => {
  
  const [openModal, isOpenModal] = useState(false);

  const [skills, setSkills] = useState<SkillProject[]>([]);
  const [loading, isLoading] = useState(false);
  const [hotReload, activateHotReload] = useState(false);

  const addSkillToProject = ( skill : SkillProject ) => {
    setSkills( [...skills, skill] );
    activateHotReload(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        isLoading(true);
        const axiosResult = await getTechnologiesForProject(3);
        if( axiosResult.status == 200 ){
          const data = axiosResult.data;
          setSkills(data.skills);
        }
      }catch(error){
        alert(error);
        isLoading(false);
      }finally{
        isLoading(false);
      }
    };

    fetchData();
  }, []);

  // effect refa misy hot reload fotsiny

  useEffect(() => {
    return(
      activateHotReload(false)
    )
  }, [hotReload, openModal]);



  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <button
                onClick={() => isOpenModal(true)}
                data-modal-target="crud-modal"
                data-modal-toggle="crud-modal"
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                Ajouter
              </button>
            </th>
            <th scope="col" className="px-6 py-3">
              Technologie
            </th>
            <th scope="col" className="px-6 py-3">
              Personne requis
            </th>
            <th scope="col" className="px-6 py-3">
              Niveau
            </th>
            <th scope="col" className="px-6 py-3">
              Remarques
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>

          {
            !loading && !hotReload && skills &&
              skills.map( (skill: SkillProject, _) => {

                return (

                    <tr key={_} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="checkbox-table-search-1" className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        { skill.name }
                      </th>
                      <td className="px-6 py-4">
                        { skill.effectif }
                      </td>
                      <td className="px-6 py-4">
                        { skill.required_level }
                      </td>
                      <td className="px-6 py-4">
                        { skill.descriptions }
                      </td>
                      <td className="flex items-center px-6 py-4">
                        <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Edit
                        </a>
                        <a
                          href="#"
                          className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                        >
                          Remove
                        </a>
                      </td>
                  </tr>
                )
              }
              )
          }
        </tbody>
      </table>

      <AddTechStack
        openModal={openModal}
        closeModal={() => isOpenModal(false)}
        onSubmit={addSkillToProject}
        toggleModal={isOpenModal}
      />
    </div>
  );
};

export default TechStack;
