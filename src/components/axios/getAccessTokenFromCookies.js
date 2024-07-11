import { Cookies } from 'react-cookie';

const getAccessTokenFromCookies = () => {
    const cookies = new Cookies();
    return cookies.get('accessToken');
};

export default getAccessTokenFromCookies;
