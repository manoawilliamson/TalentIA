import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import SkillCreation from "./SkillCreation";

const Skills = () => {
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
            <Breadcrumb pageName="Skills - Overview" />
    
            <div className="flex flex-col gap-9">
                {/* Creation Form */}
                <div className="flex flex-col gap-9">
                    <SkillCreation reload={reloadCreation} toUpdateData={toUpdateData} isUpdate={isUpdate} reloadTrigger={() => setReloadCreation(true)} />
                </div>
                
                {/* View Lists Button */}
                <div className="flex flex-col items-center justify-center p-8 border border-gray-700 rounded-2xl">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-4">View Skills List</h3>
                        <p className="text-gray-400 mb-6">Manage and view all skills in the unified lists page</p>
                        <button
                            onClick={() => navigate('/lists')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                        >
                            <span>Go to Lists</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

};

export default Skills;