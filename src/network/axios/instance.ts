import axios from 'axios';
import { REACT_APP_BASE_URL } from "../../config"

const instance = axios.create({
    baseURL: '',
    timeout: 40000
});
instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = localStorage.getItem("Token");
    config.headers['User-Name'] = localStorage.getItem("UserName");
    config.headers['Access-Control-Allow-Origin'] = REACT_APP_BASE_URL
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    return Promise.resolve(response.data);
}, (error) => {
    if(String(error).indexOf('timeout')>=0) return Promise.reject({msg: "请求超时！"});
    if(error.response.status===403 && error.response.data.message==='token验证失败'){
        // eslint-disable-next-line
        window.location.replace(window.location.origin + '/#/' + 'login')
        return Promise.reject({msg: "token验证失败"});
    }
    return Promise.reject(error);
});

export default instance;
