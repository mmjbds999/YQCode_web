import config from "@/config"
import http from "@/utils/request"

export default {
	project: {
		list: {
			url: `${config.API_URL}/projects/list`,
			name: "项目列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL}/projects/save`,
			name: "创建-保存项目",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		start: {
			url: `${config.API_URL}/projects/start`,
			name: "启动项目",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		stop: {
			url: `${config.API_URL}/projects/stop`,
			name: "停止项目",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		restart: {
			url: `${config.API_URL}/projects/restart`,
			name: "重启项目",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
