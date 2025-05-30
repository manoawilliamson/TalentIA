import React, { useState } from 'react';

// ...interface Person et FichePersonProps...

const DummyGraph = () => (
    <div className="flex items-center justify-center h-64 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-inner">
        <span className="text-blue-400 text-lg font-semibold">[Graphique ici]</span>
    </div>
);

const AdvancedTable = () => {
    // Données fictives
    const rows = [
        { year: "2023", score: 85 },
        { year: "2024", score: 92 },
        { year: "2025", score: 88 },
    ];

    // États pour les filtres
    const [yearFilter, setYearFilter] = useState('');
    const [scoreFilter, setScoreFilter] = useState('');

    // Filtrage dynamique
    const filteredRows = rows.filter(row =>
        row.year.includes(yearFilter) &&
        row.score.toString().includes(scoreFilter)
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border mt-4 rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-blue-50">
                        <th className="border px-4 py-3 text-left">
                            Année
                            <input
                                type="text"
                                value={yearFilter}
                                onChange={e => setYearFilter(e.target.value)}
                                placeholder="Filtrer"
                                className="block mt-2 px-2 py-1 border border-blue-200 rounded w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </th>
                        <th className="border px-4 py-3 text-left">
                            Score
                            <input
                                type="text"
                                value={scoreFilter}
                                onChange={e => setScoreFilter(e.target.value)}
                                placeholder="Filtrer"
                                className="block mt-2 px-2 py-1 border border-blue-200 rounded w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.length === 0 ? (
                        <tr>
                            <td colSpan={2} className="border px-4 py-4 text-center text-gray-400 bg-gray-50">
                                Aucun résultat
                            </td>
                        </tr>
                    ) : (
                        filteredRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-blue-50 transition">
                                <td className="border px-4 py-3">{row.year}</td>
                                <td className="border px-4 py-3">{row.score}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
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
            {tab === 1 && <DummyGraph />}
            {tab === 2 && <AdvancedTable />}
        </div>
    );
};

export default FichePerson;