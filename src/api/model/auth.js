import config from "@/config"
import http from "@/utils/request"

export default {
	token: {
		url: `${config.API_URL}/auth/login`,
		name: "登录获取TOKEN",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	getUser: {
		url: `${config.API_URL}/auth/getUser`,
		name: "登录获取当前登录用户信息",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
	}
}
