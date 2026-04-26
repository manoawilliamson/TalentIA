import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaCode, FaUsers } from 'react-icons/fa';

const ECommerce: React.FC = () => {
  const [collabCount, setCollabCount] = useState<number>(0);
  const [skillCount, setSkillCount] = useState<number>(0);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes, personsRes] = await Promise.all([
          fetch('http://localhost:8080/api/projects'),
          fetch('http://localhost:8080/api/skills'),
          fetch('http://localhost:8080/api/person')
        ]);

        const [projectsData, skillsData, personsData] = await Promise.all([
          projectsRes.json(),
          skillsRes.json(),
          personsRes.json()
        ]);

        const projectsArray = Array.isArray(projectsData) ? projectsData : (projectsData.projects || projectsData.data || []);
        const skillsArray = Array.isArray(skillsData) ? skillsData : (skillsData.skills || skillsData.data || []);
        const personsArray = Array.isArray(personsData) ? personsData : (personsData.data || []);

        setProjectCount(projectsArray.length);
        setSkillCount(skillsArray.length);
        setCollabCount(personsArray.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre système TalentIA</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Projects Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaProjectDiagram className="text-blue-600 text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{projectCount}</h3>
          <p className="text-gray-600 text-sm">Projets Actifs</p>
        </div>

        {/* Skills Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaCode className="text-purple-600 text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{skillCount}</h3>
          <p className="text-gray-600 text-sm">Compétences Disponibles</p>
        </div>

        {/* Users Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-green-600 text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{collabCount}</h3>
          <p className="text-gray-600 text-sm">Collaborateurs</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button className="flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaProjectDiagram className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Nouveau Projet</p>
              <p className="text-sm text-gray-600">Créer un projet</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaCode className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ajouter Compétence</p>
              <p className="text-sm text-gray-600">Gérer les compétences</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Nouveau Collaborateur</p>
              <p className="text-sm text-gray-600">Ajouter une personne</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
