import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})


//插件函数到处必须有默认成员
export default ({ store}) => {//TODO:后端渲染的时候看一下store的内容
    
    request.interceptors.request.use(function (config) {

        const { user } = store.state;
        if(user && user.token){
            config.headers.Authorization = `Token ${user.token}`;
        }
    
        return config;
    }, function (error) {
        return Promise.reject(error);
    });
}