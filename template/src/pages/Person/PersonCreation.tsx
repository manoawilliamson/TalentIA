import { useEffect, useState } from "react";
import { FaUser, FaSave, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { addPerson, updatePerson } from "../../services/Person.service";

interface Person {
  id?: number;
  name: string;
  firstname: string;
  birthday: string;
  address: string;
  email: string;
  telephone: string;
}

interface Errors {
  [key: string]: string;
}

interface PersonCreationProps {
  reloadTrigger: () => void;
  toUpdateData?: Person | null;
  reload?: boolean;
  isUpdate?: boolean;
}

const PersonCreation = ({
  reloadTrigger,
  toUpdateData = null,
  reload = false,
  isUpdate = false,
}: PersonCreationProps) => {
  const actionName = !isUpdate ? "Ajouter" : "Modifier";
  const [person, setPerson] = useState<Person>(
    toUpdateData != null
      ? toUpdateData
      : {
          name: "",
          firstname: "",
          birthday: "",
          address: "",
          email: "",
          telephone: "",
        }
  );
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

const validate = () => {
  const newErrors: Errors = {};
  if (!person.name) newErrors.name = "Name is required";
  if (!person.firstname) newErrors.firstname = "First name is required";
  if (!person.birthday) {
    newErrors.birthday = "Birthday is required";
  } else {
    // Vérifie l'âge
    const today = new Date();
    const birthDate = new Date(person.birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      newErrors.birthday = "Vous devez avoir au moins 18 ans.";
    }
  }
  if (!person.address) newErrors.address = "Address is required";
  if (!person.email) {
    newErrors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(person.email)) {
    newErrors.email = "Email invalide";
  }
  if (!person.telephone) {
    newErrors.telephone = "Telephone is required";
  } else if (!/^\d{10}$/.test(person.telephone)) {
    newErrors.telephone = "Le téléphone doit contenir 10 chiffres";
  }
  return newErrors;
};

  const submitPerson = async (event: React.MouseEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    await addPerson(person); // <-- Utilise la fonction du service
    setLoading(false);
    reloadTrigger();
  };

  const updatePersonAction = async (event: React.MouseEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    await updatePerson(person); // <-- Utilise la fonction du service
    setLoading(false);
    reloadTrigger();
  };

  const performAction = async (event: React.MouseEvent) => {
    if (!isUpdate) {
      await submitPerson(event);
    } else {
      await updatePersonAction(event);
    }
  };

  
  useEffect(() => {
    if (toUpdateData != null) {
      setLoading(true);
      setPerson(toUpdateData);
      setLoading(false);
    }
  }, [reload, toUpdateData]);

  return (
    !loading && (
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaUser className="text-blue-600 text-sm" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {isUpdate ? "Modifier une personne" : "Ajouter une personne"}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="mr-2 inline text-blue-600" />
              Nom
            </label>
            <input
              type="text"
              name="name"
              value={person.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder="Entrez le nom"
            />
            {errors.name && <span className="error-message text-red-500 text-sm mt-1">{errors.name}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="mr-2 inline text-blue-600" />
              Prénom
            </label>
            <input
              type="text"
              name="firstname"
              value={person.firstname}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder="Entrez le prénom"
            />
            {errors.firstname && <span className="error-message text-red-500 text-sm mt-1">{errors.firstname}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="mr-2 inline text-blue-600" />
              Date de naissance
            </label>
            <input
              type="date"
              name="birthday"
              value={person.birthday}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
            {errors.birthday && <span className="error-message text-red-500 text-sm mt-1">{errors.birthday}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaMapMarkerAlt className="mr-2 inline text-blue-600" />
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={person.address}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder="Entrez l'adresse"
            />
            {errors.address && <span className="error-message text-red-500 text-sm mt-1">{errors.address}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="mr-2 inline text-blue-600" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={person.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder="Entrez l'email"
            />
            {errors.email && <span className="error-message text-red-500 text-sm mt-1">{errors.email}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="mr-2 inline text-blue-600" />
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={person.telephone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder="Entrez le numéro de téléphone"
            />
            {errors.telephone && <span className="error-message text-red-500 text-sm mt-1">{errors.telephone}</span>}
          </div>

          <button
            type="button"
            onClick={performAction}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <FaSave className="text-sm" />
            {actionName}
          </button>
        </div>
      </div>
    )
  );
};

export default PersonCreation;