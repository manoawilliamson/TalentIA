import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FicheProjet from './FicheProjet';
import { getProjects } from '../../services/projects.service';

const FicheProjetWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) {
        setError('No project ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch all projects and find the one we need
        const projectsResponse = await getProjects();
        console.log('Projects response:', projectsResponse);
        
        // Handle different response structures
        let allProjects: any[] = [];
        if (Array.isArray(projectsResponse)) {
          allProjects = projectsResponse;
        } else if (projectsResponse && typeof projectsResponse === 'object' && 'projects' in projectsResponse && Array.isArray((projectsResponse as any).projects)) {
          allProjects = (projectsResponse as any).projects;
        } else if (projectsResponse && typeof projectsResponse === 'object' && 'data' in projectsResponse && Array.isArray((projectsResponse as any).data)) {
          allProjects = (projectsResponse as any).data;
        }
        
        console.log('Projects array:', allProjects);
        const project = allProjects.find((p: any) => p.id === parseInt(id));
        
        if (!project) {
          setError('Project not found');
          setLoading(false);
          return;
        }

        // Format the data to match what FicheProjet expects
        const formattedData = {
          project: project,
          proskills: [] // You can fetch project skills separately if needed
        };
        
        setProjectData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data');
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Error</h3>
          <p className="text-gray-400 mb-6">{error || 'Project not found'}</p>
          <button
            onClick={() => navigate('/lists')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Lists
          </button>
        </div>
      </div>
    );
  }

  return <FicheProjet data={projectData} />;
};

export default FicheProjetWrapper;
