import React, { useEffect, useState } from 'react';

const TableOne = () => {
  const [techs, setTechs] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/person/stat')
      .then(res => res.json())
      .then(res => setTechs(res.data || []));
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Collaborateurs
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nom
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5"></div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nombre de Projet
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5"></div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Pourcentage
            </h5>
          </div>
        </div>

        {techs.map((tech, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${key === techs.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
              }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block">
                {tech.person_name}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5"></div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{tech.project_count}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5"></div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">
                {Number(tech.participation_percentage) ? Number(tech.participation_percentage).toFixed(2) : '0.00'}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;