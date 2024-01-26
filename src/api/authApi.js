import axios from 'axios';
import {bearerAuth} from "./bearerAuth";

let AUTH_URL_POSTFIX = "/api/v1/auth"

const authApi = (url) => {
    const client = axios.create({
        baseURL: process.env.REACT_APP_API_BACKEND_URL + url,
        // baseURL: "https://localhost:443" + url,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    client.interceptors.response.use(
        (response) => {
            return response;
        },
        function (error) {
            if (error.response) {
                const responseData = error.response.data;
                if (responseData && responseData.info === 'loginLimitExceeded') {
                    return Promise.reject({
                        status: error.response.status,
                        message: 'loginLimitExceeded',
                    });
                }
                if (responseData && responseData.info === 'registerLimitExceeded') {
                    return Promise.reject({
                        status: error.response.status,
                        message: 'registerLimitExceeded',
                    });
                }
                return Promise.reject(error.response);
            } else if (error.request) {
                return Promise.reject({
                    status: 500,
                    message: 'noResponseFromServer',
                });
            } else {
                return Promise.reject({
                    status: 500,
                    message: 'unexpectedError',
                });
            }
        }
    );

    return client;
};

const authService = {
    login: async (email, password, totp) => {
        try {
            const response = await authApi(AUTH_URL_POSTFIX).post('/authenticate', { email, password, totpCode: totp });
            return response;
        } catch (error) {
            throw error;
        }
    },

    register: async (firstname, lastname, email, password) => {
        console.log(process.env.REACT_APP_API_BACKEND_URL)
        try {
            const response = await authApi(AUTH_URL_POSTFIX).post('/register', { firstname, lastname, email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async (accessToken) => {
        try {
            const response = await authApi(AUTH_URL_POSTFIX).post('/logout', null, {
                headers: { Authorization: bearerAuth(accessToken) }
            });
            return response.data;
        } catch (error) {
            console.log("Unsuccessful logout")
        }
    },
};

export default authService;
