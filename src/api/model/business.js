import config from "@/config"
import http from "@/utils/request"

export default {
	project: {
		save: {
			url: `${config.API_URL}/projects/save`,
			name: "创建-保存项目",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	}
}
