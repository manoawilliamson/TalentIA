import { useEffect, useState } from "react";
import { getPersons, deletePerson } from "../../services/Person.service";
import FichePerson from "./FichePerson";

interface Person {
  id?: number;
  name: string;
  firstname: string;
  birthday?: string;
  address?: string;
  email: string;
  telephone?: string;
  poste?: string;
  departement?: string;
}

interface PersonListProps {
  reload: boolean;
  enableUpdate?: (person: Person) => void;
}

const PersonList = ({ reload, enableUpdate }: PersonListProps) => {
  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Pour le modal
  const [modalOpen, setModalOpen] = useState(false);
  const [ficheData, setFicheData] = useState<Person | null>(null);

  const updatePerson = (id?: number) => {
    const person = data.find((p) => p.id === id);
    if (person && enableUpdate) enableUpdate(person);
  };

  // Ouvre le modal fiche personne
  const openFichePerson = (person: Person) => {
    setFicheData(person);
    setModalOpen(true);
  };

  const deletePersons = async (id?: number) => {
    if (id == null) return;
    setIsLoading(true);
    await deletePerson(id);
    setData(data.filter((p) => p.id !== id));
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getPersons();
      if (Array.isArray(response)) {
        setData(response);
      } else if (response && Array.isArray(response.persons)) {
        setData(response.persons);
      } else {
        setData([]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [reload]);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, [isLoading]);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Liste des personnes
        </h4>
      </div>

      <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
          <p className="font-medium">#</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Nom</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Prénom</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Email</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium"></p>
        </div>
      </div>

      {!isLoading &&
        data.map((person, key) => (
          <div
            className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            key={key}
            onClick={() => openFichePerson(person)}
          >
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-yellow-500">{person.id}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">{person.name}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">{person.firstname}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">{person.email}</p>
            </div>
            <div
              className="col-span-1 flex items-center"
              onClick={e => { e.stopPropagation(); deletePersons(person.id); }}
            >
              <i className="text-sm cursor-pointer">
                <svg
                  width="25px"
                  height="25px"
                  className="fill-red-500"
                  viewBox="0 0 24 24"
                  color="red"
                  fill="red"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    color="red"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                    fill="#0F1729"
                  />
                </svg>
              </i>
            </div>
          </div>
        ))}

      {/* Modal pour la fiche personne */}
      {modalOpen && ficheData && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
        <div
          className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl relative border-2 border-gray-400 box-border" // max-w-4xl ici
          style={{ maxHeight: "200vh", overflowY: "auto" }}
        >
          <button
            className="absolute top-2 right-2 text-xl"
            onClick={() => setModalOpen(false)}
          >×</button>
          <FichePerson data={ficheData} />
        </div>
      </div>
    )}
    </div>
  );
};

export default PersonList;