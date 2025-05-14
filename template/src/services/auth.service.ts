import axios from "axios";
import BASE_URL from "./api";

const LogIn = async ( data: any ) => {

    const url = `${BASE_URL}/login`;

    const response = await axios.post(url, JSON.stringify(data), {
        headers: {
            "Content-Type" : "application/json"
        }
    }).catch((error) => {
        return error.response;
    }  );

    return response;

};

export {
    LogIn
}