import axios from "axios";
import getAccessTokenFromCookies from "./getAccessTokenFromCookies"; // 방금 만든 함수

const createWithJwtAxios = () => {
    // const accessToken = getAccessTokenFromCookies();
    
    const headers = {
        'Content-Type': 'application/json',
        // 'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        'Access-Control-Allow-Origin': '*',
    };

    const withJwtAxios = axios.create({
        baseURL: '/api/',
        headers: headers
    });

    withJwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            const code = error.response.status;
            window.location.href = "/users/sign-in";
            return Promise.reject(error);
        }
    );

    return withJwtAxios;
};

export default createWithJwtAxios();
