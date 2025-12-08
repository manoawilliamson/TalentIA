import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { getSkills } from "../../services/Skills.service";
import type { Skill } from "../../types/skill";

export interface MonthlyAverage {
    month: string;
    average_skill: string;
}

export interface PersonSkillHistory {
    personskills: any[];
    monthlyAverages: any[];
}

// Graphique
const Graphique = ({ personskills }: { personskills: any[] }) => {
    const today = new Date().toISOString().slice(0, 10);
    const [dateStart, setDateStart] = useState(today);
    const [dateEnd, setDateEnd] = useState(today);
    const [skillFilter, setSkillFilter] = useState('');

    const filteredSkills = useMemo(
        () =>
            (personskills ?? []).filter(
                s =>
                    s.dateupdate >= dateStart &&
                    s.dateupdate <= dateEnd &&
                    (skillFilter === '' || s.skill.toLowerCase().includes(skillFilter.toLowerCase()))
            ),
        [personskills, dateStart, dateEnd, skillFilter]
    );

    const graphData = useMemo(() => {
        const map: { [date: string]: { [skill: string]: number } } = {};
        filteredSkills.forEach(s => {
            if (!map[s.dateupdate]) map[s.dateupdate] = {};
            map[s.dateupdate][s.skill] = Number(s.noteskill);
        });
        return Object.entries(map).map(([date, skills]) => ({
            date,
            ...skills
        }));
    }, [filteredSkills]);

    const skillsInData = useMemo(
        () => Array.from(new Set(filteredSkills.map(s => s.skill))),
        [filteredSkills]
    );

    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-blue-700">Date début</label>
                    <input
                        type="date"
                        value={dateStart}
                        onChange={e => setDateStart(e.target.value)}
                        className="border rounded px-2 py-1 w-40"
                        max={dateEnd}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-blue-700">Date fin</label>
                    <input
                        type="date"
                        value={dateEnd}
                        onChange={e => setDateEnd(e.target.value)}
                        className="border rounded px-2 py-1 w-40"
                        min={dateStart}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-blue-700">Compétence</label>
                    <input
                        type="text"
                        value={skillFilter}
                        onChange={e => setSkillFilter(e.target.value)}
                        className="border rounded px-2 py-1 w-40"
                        placeholder="Filtrer par compétence"
                    />
                </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        {skillsInData.map(skill => (
                            <Line
                                key={skill}
                                type="monotone"
                                dataKey={skill}
                                stroke="#2563eb"
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Historique (Tableau d'évolution)
const AdvancedTable = ({
    personskills,
    monthlyAverages
}: {
    personskills: any[];
    monthlyAverages?: any[];
}) => {
    const today = new Date().toISOString().slice(0, 10);
    const [dateStart, setDateStart] = useState(today);
    const [dateEnd, setDateEnd] = useState(today);
    const [skillFilter, setSkillFilter] = useState('');

    const filteredSkills = useMemo(
        () =>
            (personskills ?? []).filter(
                s =>
                    s.dateupdate >= dateStart &&
                    s.dateupdate <= dateEnd &&
                    (skillFilter === '' || s.skill.toLowerCase().includes(skillFilter.toLowerCase()))
            ),
        [personskills, dateStart, dateEnd, skillFilter]
    );

    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-blue-700">Date début</label>
                    <input
                        type="date"
                        value={dateStart}
                        onChange={e => setDateStart(e.target.value)}
                        className="border rounded px-2 py-1 w-40"
                        max={dateEnd}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-blue-700">Date fin</label>
                    <input
                        type="date"
                        value={dateEnd}
                        onChange={e => setDateEnd(e.target.value)}
                        className="border rounded px-2 py-1 w-40"
                        min={dateStart}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-blue-700">Compétence</label>
                    <input
                        type="text"
                        value={skillFilter}
                        onChange={e => setSkillFilter(e.target.value)}
                        className="border rounded px-2 py-1 w-40"
                        placeholder="Filtrer par compétence"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border mt-4 rounded-lg overflow-hidden shadow">
                    <thead>
                        <tr className="bg-blue-50">
                            <th className="border px-4 py-3">Compétence</th>
                            <th className="border px-4 py-3">Note</th>
                            <th className="border px-4 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSkills.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="border px-4 py-4 text-center text-gray-400 bg-gray-50">
                                    Aucun résultat
                                </td>
                            </tr>
                        ) : (
                            filteredSkills.map((row, idx) => (
                                <tr key={idx} className="hover:bg-blue-50 transition">
                                    <td className="border px-4 py-3">{row.skill}</td>
                                    <td className="border px-4 py-3">{row.noteskill}</td>
                                    <td className="border px-4 py-3">{row.dateupdate}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {monthlyAverages && monthlyAverages.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Moyennes mensuelles</h4>
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="border px-4 py-2">Mois</th>
                                <th className="border px-4 py-2">Moyenne</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyAverages.map((avg: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="border px-4 py-2">{avg.month}</td>
                                    <td className="border px-4 py-2">{Number(avg.average_skill).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Tableau Skill avec bouton d'ajout, édition et suppression
const SkillsTable = ({
    personskills,
    availableSkills,
    onAddSkill,
    onEditSkill,
}: {
    personskills: any[];
    availableSkills: Skill[];
    onAddSkill: (skillId: string, noteskill: string) => void;
    onEditSkill: (personSkillId: number, noteskill: string) => void;
}) => {
    const [showAdd, setShowAdd] = useState(false);
    const [skillId, setSkillId] = useState('');
    const [noteskill, setNoteskill] = useState('');
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [editNote, setEditNote] = useState('');

    const handleSave = () => {
        if (skillId && noteskill !== '') {
            onAddSkill(skillId, noteskill);
            setSkillId('');
            setNoteskill('');
            setShowAdd(false);
        }
    };

    const handleEdit = (idx: number, currentNote: string) => {
        setEditIdx(idx);
        setEditNote(currentNote);
    };

    const handleEditSave = (personSkillId: number) => {
        if (!personSkillId) {
            alert("Identifiant de compétence manquant !");
            return;
        }
        onEditSkill(personSkillId, editNote);
        setEditIdx(null);
        setEditNote('');
    };

    return (
        <div className="p-4">
            <div className="mb-2 flex justify-between items-center">
                <span className="font-semibold text-lg">Compétences</span>
                <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => setShowAdd(true)}
                >
                    Ajouter une compétence
                </button>
            </div>
            <table className="min-w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-4 py-2 border">Skill</th>
                        <th className="px-4 py-2 border">Niveau</th>
                        <th className="px-4 py-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {showAdd && (
                        <tr className="bg-green-50 dark:bg-gray-700">
                            <td className="px-4 py-2 border">
                                <select
                                    className="border rounded px-2 py-1 w-full"
                                    value={skillId}
                                    onChange={e => setSkillId(e.target.value)}
                                >
                                    <option value="">Choisir...</option>
                                    {availableSkills.map(skill => (
                                        <option key={skill.id} value={skill.id}>
                                            {skill.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    className="border rounded px-2 py-1 w-full"
                                    value={noteskill}
                                    onChange={e => setNoteskill(e.target.value)}
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <button
                                    className="text-green-600 hover:underline mr-2"
                                    onClick={handleSave}
                                    disabled={!skillId || noteskill === ''}
                                >
                                    Valider
                                </button>
                                <button
                                    className="text-gray-600 hover:underline"
                                    onClick={() => setShowAdd(false)}
                                >
                                    Annuler
                                </button>
                            </td>
                        </tr>
                    )}
                    {personskills.map((skill, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-2 border">{skill.skill}</td>
                            <td className="px-4 py-2 border">
                                {editIdx === idx ? (
                                    <input
                                        type="number"
                                        min={0}
                                        max={10}
                                        className="border rounded px-2 py-1 w-full"
                                        value={editNote}
                                        onChange={e => setEditNote(e.target.value)}
                                    />
                                ) : (
                                    skill.noteskill
                                )}
                            </td>
                            <td className="px-4 py-2 border">
                                {editIdx === idx ? (
                                    <>
                                        <button
                                            className="text-green-600 hover:underline mr-2"
                                            onClick={() => handleEditSave(skill.idskill)}
                                            disabled={editNote === ''}
                                        >
                                            Sauver
                                        </button>
                                        <button
                                            className="text-gray-600 hover:underline"
                                            onClick={() => setEditIdx(null)}
                                        >
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="text-blue-600 hover:underline mr-2"
                                            onClick={() => handleEdit(idx, skill.noteskill)}
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const FichePerson: React.FC<any> = ({ data }) => {
    const [tab, setTab] = useState(0);
    const [personSkills, setPersonSkills] = useState<any[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [monthlyAverages, setMonthlyAverages] = useState<any[]>([]);

    console.log('data:', data);

    useEffect(() => {
        if (data?.id) {
            fetch(`http://localhost:8080/api/personskills/${data.id}`)
                .then(res => res.json())
                .then(res => {
                    if (res && Array.isArray(res.personskills)) {
                        setPersonSkills(res.personskills);
                    } else if (Array.isArray(res)) {
                        setPersonSkills(res);
                    } else {
                        setPersonSkills([]);
                    }
                });
        }
    }, [data?.id]);

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

    useEffect(() => {
        if (data?.id) {
            fetch(`http://localhost:8080/api/personskills/history/${data.id}`)
                .then(res => res.json())
                .then(res => {
                    setHistoryData(res.personskills || []);
                    setMonthlyAverages(res.monthlyAverages || []);
                });
        }
    }, [data?.id]);

    const handleAddSkill = async (skillId: string, noteskill: string) => {
        const response = await fetch(`http://localhost:8080/api/personskills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idperson: data.id,
                idskills: Number(skillId),
                noteskills: Number(noteskill),
            }),
        });
        const result = await response.json();
        if (response.ok) {
            fetch(`http://localhost:8080/api/personskills/${data.id}`)
                .then(res => res.json())
                .then(res => {
                    if (res && Array.isArray(res.personskills)) {
                        setPersonSkills(res.personskills);
                    }
                });
        } else {
            let msg = result?.message || result?.error || '';
            if (result?.validation) {
                msg += '\n' + Object.values(result.validation).join('\n');
            }
            alert("Erreur lors de l'ajout du skill: " + msg);
        }
    };

    // Edition d'une compétence (insère une nouvelle note)
    const handleEditSkill = async (personSkillId: number, noteskill: string) => {
        const skillRow = personSkills.find(s => s.idskill === personSkillId);
        if (!skillRow) {
            alert("Skill introuvable");
            return;
        }

        const response = await fetch(`http://localhost:8080/api/personskills/${personSkillId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idperson: skillRow.idperson,
                idskill: skillRow.idskill,
                noteskill: Number(noteskill),
            }),
        });
        const result = await response.json();
        if (response.ok) {
            fetch(`http://localhost:8080/api/personskills/${data.id}`)
                .then(res => res.json())
                .then(res => {
                    if (res && Array.isArray(res.personskills)) {
                        setPersonSkills(res.personskills);
                    }
                });
        } else {
            alert("Erreur lors de la modification du skill: " + JSON.stringify(result));
        }
    };

    if (!data) return null;

    const onglets = [
        {
            ref: 'infos',
            name: 'Informations',
            component: (
                <ul className="space-y-3 text-lg">
                    <li><span className="font-semibold text-blue-600">Email :</span> {data.email}</li>
                    {data.telephone && <li><span className="font-semibold text-blue-600">Téléphone :</span> {data.telephone}</li>}
                    {data.poste && <li><span className="font-semibold text-blue-600">Poste :</span> {data.poste}</li>}
                    {data.departement && <li><span className="font-semibold text-blue-600">Département :</span> {data.departement}</li>}
                    {data.birthday && <li><span className="font-semibold text-blue-600">Date de naissance :</span> {data.birthday}</li>}
                    {data.address && <li><span className="font-semibold text-blue-600">Adresse :</span> {data.address}</li>}
                </ul>
            ),
        },
        {
            ref: 'skills',
            name: 'Skill',
            component: (
                <SkillsTable
                    personskills={personSkills}
                    availableSkills={availableSkills}
                    onAddSkill={handleAddSkill}
                    onEditSkill={handleEditSkill}
                />
            ),
        },
        {
            ref: 'graph',
            name: 'Graphique',
            component: <Graphique personskills={personSkills} />,
        },
        {
            ref: 'table',
            name: "Tableau d'évolution",
            component: <AdvancedTable personskills={historyData} monthlyAverages={monthlyAverages} />,
        },
    ];

    return (
        <div className="flex flex-col p-3">
            <div className="project-title mb-4">
                <h3 className="text-4xl font-bold dark:text-white text-center">
                    {data.firstname} {data.name}
                </h3>
            </div>

            <div className="details-container my-4 card p-3 rounded-lg dark:bg-blue-950 dark:text-gray-200 bg-white">
                <div className="mb-8 border-b border-blue-100">
                    <nav className="flex space-x-6">
                        {onglets.map((onglet, index) => (
                            <button
                                key={onglet.ref}
                                className={`py-2 px-4 border-b-2 transition-all duration-200 ${tab === index ? 'border-blue-500 text-blue-700 font-semibold' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
                                onClick={() => setTab(index)}
                            >
                                {onglet.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="onglet my-2">
                    <div className="details">{onglets[tab].component}</div>
                </div>
            </div>
        </div>
    );
};

export default FichePerson;