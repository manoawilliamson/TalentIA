import { useEffect, useState } from "react";
import { Skill } from "../../types/skill";
import { deleteSkill, getSkills } from "../../services/Skills.service";

interface SkillListProps{
    reload: boolean;
    enableUpdate?: any;
}

  
const SkillList = ( {reload, enableUpdate} : SkillListProps ) => {

    const [data, setData] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updateSkill = (key: any) => {
        const skill: Skill | undefined = data.find(skills => skills.id === key);
        enableUpdate(skill);
    };

    const deleteSkills = async (id: number | undefined) => {
        if( id == undefined ) return;
        setIsLoading(true);
        await deleteSkill(id);
        const newData = data.filter( data => data.id !== id );
        setData(newData);
        setIsLoading(false);
        
    };

    useEffect( () => {
        const fetchData = async () => {
            setIsLoading(true);
            const skills = await getSkills();
            setData(skills);
            setIsLoading(false);
        };
        fetchData();
    }, [reload]);

    useEffect(()=>{
        return () => {
            setIsLoading(false);
        }
    },[isLoading]);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Les skills
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
                    <p className="font-medium">Category</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium"></p>
                </div>
            </div>

            {!isLoading && data.map((product, key) => (
                <div
                className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                key={key}
                >
                    <div className="col-span-1 flex items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <p 
                            onClick={ () => updateSkill(product.id) }
                            className="text-sm text-yellow-500 cursor-pointer"
                        >
                            {product.id}
                        </p>
                        </div>
                    </div>
                    <div className="col-span-3 hidden items-center sm:flex">
                        <p className="text-sm text-black dark:text-white">
                        {product.name}
                        </p>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                        {product.category}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <i className="text-sm cursor-pointer"

                            onClick={() => deleteSkills(product.id)}
                        >
                        <svg 
                        width="25px" height="25px" className="fill-red-500" viewBox="0 0 24 24" color="red" fill="red" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                color="red"
                                fill-rule="evenodd" 
                                clip-rule="evenodd" 
                                d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729"
                            />
                            </svg>
                        </i>
                    </div>
                    
                </div>
            ))}
            </div>

    );
};

export default SkillList;