import axios from "axios";
import BASE_URL from "./api";

const LogIn = async ( data: any ) => {

    const url = `${BASE_URL}/login`;

    try {
        const response = await axios.post(url, JSON.stringify(data), {
            headers: {
                "Content-Type" : "application/json"
            }
        });
        return response;
    } catch (error: any) {
        if (error.response) {
            return error.response;
        } else {
            // Network error, CORS, etc.
            return {
                status: 0,
                data: { message: 'Network error or CORS issue' }
            };
        }
    }

};

export {
    LogIn
}
