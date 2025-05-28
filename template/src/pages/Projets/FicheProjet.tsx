import React, { useState, useEffect } from "react";
import TechStackIcon from '../../components/icons/TechStackIcon';
import RecomendationIcon from '../../components/icons/RecomendationIcon';
import AssigneeIcon from '../../components/icons/AssigneeIconc';
import GalleryIcon from '../../components/icons/GalleryIcon';
import Recomends from '../../components/Fiche/RecommendationPeoples';
import Assigned from '../../components/Fiche/AssignedEmployee';

interface FicheProjetProps {
  data: {
    project: {
      id: number;
      name: string;
      description: string;
      datebegin: string;
      dateend: string;
      nbrperson: number;
      remark: string;
      file?: string;
    };
    proskills?: { id?: number; skill: string; noteskills: string }[];
  };
}

const SkillsList = ({
  proskills,
  onEdit,
  onDelete,
  editIdx,
  editValue,
  onEditChange,
  onEditSave,
  onEditCancel,
}: {
  proskills?: { skill: string; noteskills: string }[];
  onEdit?: (idx: number) => void;
  onDelete?: (idx: number) => void;
  editIdx?: number | null;
  editValue?: { skill: string; noteskills: string };
  onEditChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditSave?: (idx: number) => void;
  onEditCancel?: () => void;
}) => (
  <div className="p-4">
    {proskills && proskills.length > 0 ? (
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-2 border">Technologie</th>
            <th className="px-4 py-2 border">Note</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {proskills.map((skill, idx) =>
            editIdx === idx ? (
              <tr key={idx} className="bg-yellow-50 dark:bg-gray-700">
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    name="skill"
                    value={editValue?.skill ?? ""}
                    onChange={onEditChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    name="noteskills"
                    value={editValue?.noteskills ?? ""}
                    onChange={onEditChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className="text-green-600 hover:underline mr-2"
                    onClick={() => onEditSave && onEditSave(idx)}
                    title="Save"
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-600 hover:underline"
                    onClick={onEditCancel}
                    title="Cancel"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              skill.skill && (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 border">{skill.skill}</td>
                  <td className="px-4 py-2 border">{skill.noteskills}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => onEdit && onEdit(idx)}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete && onDelete(idx)}
                      title="Delete"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    ) : (
      <div>Aucun skill requis</div>
    )}
  </div>
);

const FicheProjet = ({ data }: FicheProjetProps) => {
  const [activeOngletRef, setActiveOngletRef] = useState<number>(0);
  const [ActiveDetails, setActiveDetails] = useState<any>(null);

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<{ skill: string; noteskills: string }>({ skill: "", noteskills: "" });
  const [skills, setSkills] = useState(data.proskills || []);

  useEffect(() => {
    setSkills(data.proskills || []);
  }, [data.proskills]);

  if (!data || !data.project) {
    return <div>Empty.</div>;
  }

  const { project } = data;

  const handleEditSkill = (idx: number) => {
    setEditIdx(idx);
    setEditValue({ ...skills[idx] });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (idx: number) => {
    const updatedSkills = [...skills];
    updatedSkills[idx] = { ...updatedSkills[idx], ...editValue };
    setSkills(updatedSkills);
    setEditIdx(null);
  };

  const handleEditCancel = () => {
    setEditIdx(null);
  };

  const handleDeleteSkill = async (idx: number) => {
    const skill = skills[idx];
    if (!skill.id) return;

    await fetch(`/api/projectskills/${skill.id}`, {
      method: 'DELETE',
    });

    const updatedSkills = skills.filter((_, i) => i !== idx);
    setSkills(updatedSkills);
    setEditIdx(null);
  };

  // Onglets et composants
  const onglets = [
    {
      ref: 'tech',
      name: 'Technologies',
      icons: TechStackIcon,
      component: (
        <SkillsList
          proskills={skills}
          onEdit={handleEditSkill}
          onDelete={handleDeleteSkill}
          editIdx={editIdx}
          editValue={editValue}
          onEditChange={handleEditChange}
          onEditSave={handleEditSave}
          onEditCancel={handleEditCancel}
        />
      ),
    },
    {
      ref: 'rec',
      name: 'Recommandation',
      icons: RecomendationIcon,
      component: <Recomends />,
    },
    {
      ref: 'asg',
      name: 'Assignées',
      icons: AssigneeIcon,
      component: <Assigned />,
    },
    {
      ref: 'gal',
      name: 'Fichier',
      icons: GalleryIcon,
      component: project.file ? (
        <div className="flex flex-col items-center justify-center p-4">
          <a
            href={`http://localhost:8080/api/projects/download/${project.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Télécharger le fichier
          </a>
        </div>
      ) : (
        <div className="p-4 text-gray-500">Aucun fichier à afficher</div>
      ),
    },
  ];

  useEffect(() => {
    setActiveDetails(onglets[activeOngletRef].component);
  }, [activeOngletRef, skills, editIdx, editValue]);

  return (
    <div className="flex flex-col p-3">
      <div className="project-title mb-4">
        <h3 className="text-4xl font-bold dark:text-white text-center">
          {project.name}
        </h3>
      </div>

      <div className="details-container my-4 card p-3 rounded-lg dark:bg-blue-950 dark:text-gray-200 bg-white">
        <table className="w-full mb-6">
          <tbody>
            <tr>
              <td className="font-semibold py-2 pr-4">Description</td>
              <td>{project.description}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Date begin</td>
              <td>{project.datebegin}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Date end</td>
              <td>{project.dateend}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Number person</td>
              <td>{project.nbrperson}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Remarks</td>
              <td>{project.remark}</td>
            </tr>
          </tbody>
        </table>

        {/* Onglets supplémentaires */}
        <div className="onglet my-2">
          <h4 className="text-lg font-bold">Autres informations</h4>
          <div className="border-b my-2 border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              {onglets.map((onglet, index) => (
                <li className="me-2" key={onglet.ref}>
                  <a
                    href="#"
                    className={
                      'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ' +
                      (activeOngletRef === index ? ' text-green-700' : '')
                    }
                    onClick={e => {
                      e.preventDefault();
                      setActiveOngletRef(index);
                    }}
                  >
                    <onglet.icons classes="w-5 h-5 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
                    {onglet.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="details">{ActiveDetails}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FicheProjet;