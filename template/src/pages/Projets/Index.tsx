import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ProjetCreation from "./ProjetCreation";

const Projects = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [reloadCreation, setReloadCreation] = useState<boolean>(false);
    
    // Get navigation state for editing
    const state = location.state as { toUpdateData?: any; isUpdate?: boolean } || {};
    const { toUpdateData, isUpdate } = state;

    useEffect(()=>{
        return () => {
            setReloadCreation(false);
        }
    }, [reloadCreation]);

    return (
        <>
            <Breadcrumb pageName="Projects - Overview" />
    
            <div className="flex flex-col gap-9">
                {/* Creation Form */}
                <div className="flex flex-col gap-9">
                    <ProjetCreation reload={reloadCreation} toUpdateData={toUpdateData} isUpdate={isUpdate} reloadTrigger={() => setReloadCreation(true)} />
                </div>
                
                {/* View Lists Button */}
                <div className="flex flex-col items-center justify-center p-8 border border-gray-700 rounded-2xl">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-4">View Projects List</h3>
                        <p className="text-gray-400 mb-6">Manage and view all projects in the unified lists page</p>
                        <button
                            onClick={() => navigate('/lists')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <span>Go to Lists</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

};

export default Projects;