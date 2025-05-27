import { useEffect, useState } from "react";
import { addPerson, updatePerson } from "../../services/Person.service"; // <-- Ajoute cette ligne

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
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            {isUpdate ? "Modifier une personne" : "Ajouter une personne"}
          </h3>
        </div>
        <div>
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">Name</label>
              <input
                type="text"
                name="name"
                value={person.name}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
              />
              {errors.name && <span className="error-message text-red-500">{errors.name}</span>}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">First Name</label>
              <input
                type="text"
                name="firstname"
                value={person.firstname}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
              />
              {errors.firstname && <span className="error-message text-red-500">{errors.firstname}</span>}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={person.birthday}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
              />
              {errors.birthday && <span className="error-message text-red-500">{errors.birthday}</span>}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">Address</label>
              <input
                type="text"
                name="address"
                value={person.address}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
              />
              {errors.address && <span className="error-message text-red-500">{errors.address}</span>}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">Email</label>
              <input
                type="email"
                name="email"
                value={person.email}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
              />
              {errors.email && <span className="error-message text-red-500">{errors.email}</span>}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">Telephone</label>
              <input
                type="text"
                name="telephone"
                value={person.telephone}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
              />
              {errors.telephone && <span className="error-message text-red-500">{errors.telephone}</span>}
            </div>

            <button
              type="button"
              onClick={performAction}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {actionName}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default PersonCreation;