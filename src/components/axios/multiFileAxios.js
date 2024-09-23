import axios from "axios";
import { Cookies } from 'react-cookie';

// 쿠키에서 accessToken을 가져오는 함수
const getAccessTokenFromCookies = () => {
    const cookies = new Cookies();
    return cookies.get('accessToken');
};

const createMultiFileAxios = () => {
    const accessToken = getAccessTokenFromCookies();
    
    const headers = {
        'Content-type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'Authorization': accessToken ? `Bearer ${accessToken}` : ''
    };

    const multiFileAxios = axios.create({
        baseURL: '/api/',
        headers: headers
    });

    multiFileAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            const code = error.response.status;
            if(code == 401 || code == 403) {
                window.location.href = "/users/sign-in";
            }
            return Promise.reject(error);
        }
    );

    return multiFileAxios;
};

export default createMultiFileAxios();
