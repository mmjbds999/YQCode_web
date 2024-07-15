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
		checkStatus: {
			url: `${config.API_URL}/projects/checkStartStatus`,
			name: "检查项目状态",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
