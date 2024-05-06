import {defineStore} from "pinia";
import {ref} from 'vue';

/*
    defineStore参数描述：
        第一个参数：给状态起名，具有唯一性
        第二个参数：函数，可以把定义该状态中拥有的内容

    defineStore返回值描述：
        返回的是一个函数，将来可以调用该函数，得到第二个参数中返回的内容
*/
export const useTokenStore = defineStore('token', () => {
		// token
		const token = ref('')
		
		// 修改 token
		const setToken = (newToken) => {
			token.value = newToken
		}
		
		// 移除 token
		const removeToken = () => {
			token.value = ''
		}
		
		// 返回导出的内容
		return {
			token, setToken, removeToken
		}
	},
	{
		persist: true
	})