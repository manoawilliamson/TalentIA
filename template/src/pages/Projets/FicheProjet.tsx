import { useEffect, useState } from 'react';
import AssigneeIcon from '../../components/icons/AssigneeIconc';
import GalleryIcon from '../../components/icons/GalleryIcon';
import RecomendationIcon from '../../components/icons/RecomendationIcon';
import TechStackIcon from '../../components/icons/TechStackIcon';
import TechStack from '../../components/Fiche/TechStackRequired';
import Recomends from '../../components/Fiche/RecommendationPeoples';
import Assigned from '../../components/Fiche/AssignedEmployee';

const onglets = [
  {
    ref: 'tech',
    name: 'Technologies',
    icons: TechStackIcon,
    component: <TechStack />,
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
    name: 'Gallery',
    icons: GalleryIcon,
    component: null,
  },
];
const FicheProjet = () => {
  const [activeOngletRef, setActiveOngletRef] = useState<number>(0);
  const [ActiveDetails, setActiveDetails] = useState(onglets[0].component);

  const renderActiveDetails = () => {
    const TabComponent = ActiveDetails;

    if (TabComponent == null) {
      return <div> Aucun donnée trouvé </div>;
    }

    return TabComponent;
  };

  useEffect(() => {
    const onglet = onglets[activeOngletRef];
    setActiveDetails(onglet.component);

    return () => {};
  }, [activeOngletRef]);

  return (
    <>
      <div className="flex flex-col p-3">
        {/* Project title */}
        <div className="project-title">
          <h3 className="text-4xl font-bold dark:text-white">
            Projet d'assainissement des eaux
          </h3>
        </div>
        {/* End project title */}

        <div className="details-container my-4 card p-3 rounded-lg dark:bg-blue-950 dark:text-gray-200 bg-white">
          <div className="text">
            <h4 className="text-lg font-bold">Déscription du projet</h4>
            <p className="text-start">
              Pour le compte de notre client XXX, une application web a été
              demandé pour gérer les états des eaux dans la ville d'antananarivo
            </p>
          </div>
          <div className="onglet my-2">
            <h4 className="text-lg font-bold">Autres informations</h4>
            <div className="border-b my-2 border-gray-200 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                {onglets.map((onglet, index) => (
                  <li className="me-2">
                    <a
                      href="#"
                      className={
                        'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ' +
                        (activeOngletRef == index && ' text-green-700')
                      }
                      onClick={() => setActiveOngletRef(index)}
                    >
                      <onglet.icons classes="w-5 h-5 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
                      {onglet.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="details">{renderActiveDetails()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FicheProjet;
