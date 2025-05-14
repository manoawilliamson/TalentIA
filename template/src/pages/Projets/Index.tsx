import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ProjetCreation from "./ProjetCreation";
import ProjetList from "./ProjetList";
import { Projet } from "../../types/projet";

const Projects = () => {

    const [reload, setReload] = useState<boolean>(false);
    const [reloadCreation, setReloadCreation] = useState<boolean>(false);
    const [launchUpdate, setLaunchUpdate] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState<Projet | null>(null);

    const reloadDownload = () => {
        setReload(true);
    };


    const enableUpdate = ( skill: Projet ) => {
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
            <Breadcrumb pageName="Projects - Overview" />
    
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    <ProjetCreation reload={reloadCreation} toUpdateData={updateData} isUpdate={launchUpdate} reloadTrigger={reloadDownload} />
                </div>
                <div className="flex flex-col gap-9">
                    <ProjetList reload={reload} enableUpdate={enableUpdate} />
                </div>
            </div>
        </>

    );

};

export default Projects;