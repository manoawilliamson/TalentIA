import axios from 'axios';
import BASE_URL from "./api";

const API_URL = `${BASE_URL}/person`;

export interface Person {
    id?: number;
    name: string;
    firstname: string;
    birthday: string;
    address: string;
    email: string;
    telephone: string;
}

export const getPersons = async (): Promise<Person[]> => {
    const response = await axios.get<Person[]>(API_URL);
    return response.data;
};

export const getPersonById = async (id: number): Promise<Person> => {
    const response = await axios.get<Person>(`${API_URL}/${id}`);
    return response.data;
};

export const addPerson = async (person: Omit<Person, 'id'>): Promise<Person> => {
    const response = await axios.post<Person>(API_URL, person, {
        headers: { "Content-Type": "application/json" }
    });
    return response.data;
};

export const updatePerson = async (person: Person): Promise<Person> => {
    const response = await axios.put<Person>(`${API_URL}/${person.id}`, person, {
        headers: { "Content-Type": "application/json" }
    });
    return response.data;
};

export const deletePerson = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};