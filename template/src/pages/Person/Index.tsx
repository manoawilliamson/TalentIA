import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import SkillCreation from "./PersonCreation";
import SkillList from "./PersonList";
import { Skill } from "../../types/skill";

const Person = () => {

    const [reload, setReload] = useState<boolean>(false);
    const [reloadCreation, setReloadCreation] = useState<boolean>(false);
    const [launchUpdate, setLaunchUpdate] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState<Skill | null>(null);

    const reloadDownload = () => {
        setReload(true);
    };


    const enableUpdate = ( skill: Skill ) => {
        setUpdateData(skill);
        setReloadCreation(true);
        setLaunchUpdate(true);
    };

    useEffect(()=>{
        return () => {
            setReload(false)
        }
    }, [reload]);

    useEffect(()=>{
        return () => {
            setReloadCreation(false);
            // setLaunchUpdate(false);
        }
    }, [updateData]);
    

    return (
        <>
            <Breadcrumb pageName="Skills - Overview" />
    
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    <SkillCreation reload={reloadCreation} toUpdateData={updateData} isUpdate={launchUpdate} reloadTrigger={reloadDownload} />
                </div>
                <div className="flex flex-col gap-9">
                    <SkillList reload={reload} enableUpdate={enableUpdate} />
                </div>
            </div>
        </>

    );

};

export default Person;