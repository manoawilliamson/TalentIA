import React, { useState, useEffect } from "react";
import TechStackIcon from '../../components/icons/TechStackIcon';
import RecomendationIcon from '../../components/icons/RecomendationIcon';
import AssigneeIcon from '../../components/icons/AssigneeIconc';
import GalleryIcon from '../../components/icons/GalleryIcon';
import Assigned from '../../components/Fiche/AssignedEmployee';
import { getSkills } from "../../services/Skills.service";
import type { Skill } from "../../types/skill";

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
    proskills?: { idproskills: number; idskill?: number; skill: string; noteskills: string }[];
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
  adding,
  onAddClick,
  onAddChange,
  onAddSave,
  onAddCancel,
  addValue,
  availableSkills,
}: {
  proskills?: { idproskills: number; skill: string; noteskills: string }[];
  onEdit?: (idx: number) => void;
  onDelete?: (idx: number) => void;
  editIdx?: number | null;
  editValue?: { skill: string; noteskills: string };
  onEditChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditSave?: (idx: number) => void;
  onEditCancel?: () => void;
  adding?: boolean;
  onAddClick?: () => void;
  onAddChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAddSave?: () => void;
  onAddCancel?: () => void;
  addValue?: { skillId: string; noteskills: string; checked: boolean };
  availableSkills?: Skill[];
}) => (
  <div className="p-4">
    <div className="mb-2">
      <button
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        onClick={onAddClick}
        disabled={adding}
      >
        Ajouter une technologie
      </button>
    </div>
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
          {/* Ligne d'ajout */}
          {adding && (
            <tr className="bg-green-50 dark:bg-gray-700">
              <td className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={addValue?.checked || false}
                  onChange={onAddChange}
                  name="checked"
                  className="mr-2"
                />
                <select
                  name="skillId"
                  value={addValue?.skillId || ""}
                  onChange={onAddChange}
                  className="border rounded px-2 py-1 w-2/3"
                >
                  <option value="">Choisir...</option>
                  {(Array.isArray(availableSkills) ? availableSkills : []).map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} {skill.category ? `(${skill.category})` : ""}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="text"
                  name="noteskills"
                  value={addValue?.noteskills || ""}
                  onChange={onAddChange}
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <button
                  className="text-green-600 hover:underline mr-2"
                  onClick={onAddSave}
                  disabled={!addValue?.checked || !addValue?.skillId}
                >
                  Valider
                </button>
                <button
                  className="text-gray-600 hover:underline"
                  onClick={onAddCancel}
                >
                  Annuler
                </button>
              </td>
            </tr>
          )}
          {proskills.map((skill, idx) =>
            editIdx === idx ? (
              <tr key={skill.idproskills} className="bg-yellow-50 dark:bg-gray-700">
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    name="skill"
                    value={editValue?.skill ?? ""}
                    onChange={onEditChange}
                    className="border rounded px-2 py-1 w-full"
                    disabled
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
                    onClick={() => {
                      onEditSave && onEditSave(idx);
                    }}
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
                <tr key={skill.idproskills} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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

// Composant pour afficher les recommandations
const RecommendationList = ({ projectId }: { projectId: number }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedRows, setCheckedRows] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/personproject/recommendation/${projectId}`)
      .then(res => res.json())
      .then(data => {
        setRecommendations(data.recommendations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  const handleCheck = (id: number) => {
    setCheckedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <div>Chargement...</div>;
  if (!recommendations.length) return <div>Aucune recommandation trouvée.</div>;

  return (
    <div className="p-4">
      <h5 className="font-bold mb-2">Top 5 personnes recommandées</h5>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 border"></th>
              <th className="px-4 py-2 border">Nom</th>
              <th className="px-4 py-2 border">Prénom</th>
              <th className="px-4 py-2 border">Score</th>
              <th className="px-4 py-2 border">Compétences requises</th>
              <th className="px-4 py-2 border">Compétences matchées</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, idx) => (
              <tr key={rec.idperson || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={!!checkedRows[rec.idperson]}
                    onChange={() => handleCheck(rec.idperson)}
                  />
                </td>
                <td className="px-4 py-2 border">{rec.name}</td>
                <td className="px-4 py-2 border">{rec.firstname}</td>
                <td className="px-4 py-2 border">{rec.matching_score}</td>
                <td className="px-4 py-2 border">{rec.total_required_skills}</td>
                <td className="px-4 py-2 border">{rec.matched_skills}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant pour afficher les personnes assignées (API)
const AssignedList = ({ projectId }: { projectId: number }) => {
  const [assigned, setAssigned] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/personproject/${projectId}`)
      .then(res => res.json())
      .then(data => {
        setAssigned(data.persons || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>Chargement...</div>;
  if (!assigned.length) return <div>Aucune personne assignée.</div>;

  return (
    <div className="p-4">
      <h5 className="font-bold mb-2">Personnes assignées au projet</h5>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 border">Nom</th>
              <th className="px-4 py-2 border">Prénom</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Téléphone</th>
              <th className="px-4 py-2 border">Date de naissance</th>
            </tr>
          </thead>
          <tbody>
            {assigned.map((person, idx) => (
              <tr key={person.idperson || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 border">{person.name}</td>
                <td className="px-4 py-2 border">{person.firstname}</td>
                <td className="px-4 py-2 border">{person.email}</td>
                <td className="px-4 py-2 border">{person.telephone}</td>
                <td className="px-4 py-2 border">{person.birthday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FicheProjet = ({ data }: FicheProjetProps) => {
  const [activeOngletRef, setActiveOngletRef] = useState<number>(0);
  const [ActiveDetails, setActiveDetails] = useState<any>(null);

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<{ skill: string; noteskills: string }>({ skill: "", noteskills: "" });
  const [skills, setSkills] = useState(data.proskills || []);

  const [adding, setAdding] = useState(false);
  const [addValue, setAddValue] = useState<{ skillId: string; noteskills: string; checked: boolean }>({ skillId: "", noteskills: "", checked: false });

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  useEffect(() => {
    setSkills(data.proskills || []);
  }, [data.proskills]);

  useEffect(() => {
    getSkills().then(data => {
      if (data && Array.isArray(data.skills)) {
        setAvailableSkills(data.skills);
      } else if (Array.isArray(data)) {
        setAvailableSkills(data);
      } else {
        setAvailableSkills([]);
      }
    });
  }, []);

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
    const skill = skills[idx];
    const idprojet = skill.idprojet;
    const idskills = skill.idskills;
    if (!idprojet || !idskills) {
      return;
    }
    const response = await fetch(`http://localhost:8080/api/projectskills/${idprojet}/${idskills}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteskills: Number(editValue.noteskills) }),
    });
    const result = await response.json();
    if (response.ok) {
      const updatedSkills = [...skills];
      updatedSkills[idx] = { ...updatedSkills[idx], noteskills: editValue.noteskills };
      setSkills(updatedSkills);
      setEditIdx(null);
    } else {
      alert("Erreur lors de la modification du skill: " + (result?.error || JSON.stringify(result)));
    }
  };

  const handleEditCancel = () => {
    setEditIdx(null);
  };

  const handleDeleteSkill = async (idx: number) => {
    const skill = skills[idx];
    const idprojet = skill.idprojet;
    const idskills = skill.idskills;
    if (!idprojet || !idskills) {
      return;
    }

    const response = await fetch(`http://localhost:8080/api/projectskills/${idprojet}/${idskills}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setSkills(skills.filter((_, i) => i !== idx));
      setEditIdx(null);
    } else {
      const result = await response.json();
      alert("Erreur lors de la suppression du skill: " + (result?.error || JSON.stringify(result)));
    }
  };

  // Gestion ajout skill
  const handleAddClick = () => {
    setAdding(true);
    setAddValue({ skillId: "", noteskills: "", checked: false });
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setAddValue(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSave = async () => {
    if (!addValue.skillId || !addValue.checked) return;
    const response = await fetch(`http://localhost:8080/api/projectskills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idprojet: project.id,
        idskills: Number(addValue.skillId),
        noteskills: Number(addValue.noteskills),
      }),
    });
    const result = await response.json();
    if (response.ok) {
      setSkills([
        ...skills,
        {
          idproskills: result.idproskills || Math.random(),
          skill: availableSkills.find(s => s.id === Number(addValue.skillId))?.name || "",
          noteskills: addValue.noteskills,
          idskill: Number(addValue.skillId),
          ...result.skill
        },
      ]);
      setAdding(false);
    } else {
      alert("Erreur lors de l'ajout du skill: " + (result?.error || JSON.stringify(result)));
    }
  };

  const handleAddCancel = () => {
    setAdding(false);
    setAddValue({ skillId: "", noteskills: "", checked: false });
  };

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
          adding={adding}
          onAddClick={handleAddClick}
          onAddChange={handleAddChange}
          onAddSave={handleAddSave}
          onAddCancel={handleAddCancel}
          addValue={addValue}
          availableSkills={availableSkills}
        />
      ),
    },
    {
      ref: 'rec',
      name: 'Recommandation',
      icons: RecomendationIcon,
      component: <RecommendationList projectId={project.id} />,
    },
    {
      ref: 'asg',
      name: 'Assignées',
      icons: AssigneeIcon,
      component: <AssignedList projectId={project.id} />,
    },
    {
      ref: 'gal',
      name: 'Fichier',
      icons: GalleryIcon,
      component: data.project.file ? (
        <div className="flex flex-col items-center justify-center p-4">
          <a
            href={`http://localhost:8080/api/projects/download/${data.project.file}`}
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
    // eslint-disable-next-line
  }, [activeOngletRef, skills, editIdx, editValue, adding, addValue, availableSkills]);

  return (
    <div className="flex flex-col p-3">
      <div className="project-title mb-4">
        <h3 className="text-4xl font-bold dark:text-white text-center">
          {data.project.name}
        </h3>
      </div>

      <div className="details-container my-4 card p-3 rounded-lg dark:bg-blue-950 dark:text-gray-200 bg-white">
        <table className="w-full mb-6">
          <tbody>
            <tr>
              <td className="font-semibold py-2 pr-4">Description</td>
              <td>{data.project.description}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Date begin</td>
              <td>{data.project.datebegin}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Date end</td>
              <td>{data.project.dateend}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Number person</td>
              <td>{data.project.nbrperson}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Remarks</td>
              <td>{data.project.remark}</td>
            </tr>
          </tbody>
        </table>

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