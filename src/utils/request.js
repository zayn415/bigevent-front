import axios from 'axios';
import {ElMessage} from 'element-plus';
import {useTokenStore} from '@/stores/token.js';
import router from "@/router/index.js";

const baseURL = '/api'; // 跨域代理前缀
const instance = axios.create({baseURL})


//添加响应拦截器
instance.interceptors.response.use(
	// 成功的回调函数
	result => {
		// 判断业务状态
		if (result.data.code === 0) {
			return result.data;
		}
		// 操作失败
		ElMessage.error(result.data.msg ? result.data.msg : '操作失败');
		return Promise.reject(result.data);
	},
	// 失败的回调函数
	err => {
		if (err.response.status === 401) {
			ElMessage.error('请先登录');
			router.push('/login');
		} else {
			ElMessage.error('操作失败');
		}
		return Promise.reject(err);//异步的状态转化成失败的状态
	}
)

// 添加请求拦截器
instance.interceptors.request.use(
	config => {
		const token = useTokenStore().token;
		if (token) {
			config.headers['Authorization'] = token;
		}
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
)
export default instance;