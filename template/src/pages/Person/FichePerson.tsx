import React, { useState,useMemo } from 'react';
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


export interface MonthlyAverage {
    month: string;
    average_skill: string;
}

export interface PersonSkillHistory {
    personskills: any[];
    monthlyAverages: any[];
}

const Graphique = ({ personskills }: { personskills: PersonSkill[] }) => {
    // Filtres date et compétence
    const today = new Date().toISOString().slice(0, 10);
    const [dateStart, setDateStart] = useState(today);
    const [dateEnd, setDateEnd] = useState(today);
    const [skillFilter, setSkillFilter] = useState('');

    // uniqueSkills n'est plus utilisé pour le champ libre

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

    // Données pour le graphe (groupées par date et compétence)
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

    // Récupère toutes les compétences présentes dans les données filtrées
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

const AdvancedTable = ({ personskills }: { personskills: PersonSkill[] }) => {
    // Filtres date et compétence
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
        </div>
    );
};

const FichePerson: React.FC<FichePersonProps> = ({ data }) => {
    const [tab, setTab] = useState(0);
    if (!data) return null;

    return (
        <div className="fiche-person p-6 bg-white rounded-xl shadow-lg max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-6 text-blue-700 flex items-center gap-2">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fiche de {data.firstname} {data.name}
            </h2>
            <div className="mb-8 border-b border-blue-100">
                <nav className="flex space-x-6">
                    <button
                        className={`py-2 px-4 border-b-2 transition-all duration-200 ${tab === 0 ? 'border-blue-500 text-blue-700 font-semibold' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
                        onClick={() => setTab(0)}
                    >
                        Informations
                    </button>
                    <button
                        className={`py-2 px-4 border-b-2 transition-all duration-200 ${tab === 1 ? 'border-blue-500 text-blue-700 font-semibold' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
                        onClick={() => setTab(1)}
                    >
                        Graphique
                    </button>
                    <button
                        className={`py-2 px-4 border-b-2 transition-all duration-200 ${tab === 2 ? 'border-blue-500 text-blue-700 font-semibold' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
                        onClick={() => setTab(2)}
                    >
                        Tableau d'évolution
                    </button>
                </nav>
            </div>
            {tab === 0 && (
                <ul className="space-y-3 text-lg">
                    <li><span className="font-semibold text-blue-600">Email :</span> {data.email}</li>
                    {data.telephone && <li><span className="font-semibold text-blue-600">Téléphone :</span> {data.telephone}</li>}
                    {data.poste && <li><span className="font-semibold text-blue-600">Poste :</span> {data.poste}</li>}
                    {data.departement && <li><span className="font-semibold text-blue-600">Département :</span> {data.departement}</li>}
                    {data.birthday && <li><span className="font-semibold text-blue-600">Date de naissance :</span> {data.birthday}</li>}
                    {data.address && <li><span className="font-semibold text-blue-600">Adresse :</span> {data.address}</li>}
                </ul>
            )}
            {tab === 1 && <Graphique personskills={data.personskills} />}
            {tab === 2 && <AdvancedTable personskills={data.personskills} />}
        </div>
    );
};

export default FichePerson;