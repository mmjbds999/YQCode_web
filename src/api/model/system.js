import config from "@/config"
import http from "@/utils/request"

export default {
	menu: {
		myMenus: {
			url: `${config.API_URL}/menu/get`,
			name: "获取当前角色菜单",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/menu/list`,
			name: "获取所有菜单",
			get: async function(){
				return await http.get(this.url);
			}
		},
		save: {
			url: `${config.API_URL}/menu/save`,
			name: "保存菜单",
			post: async function(params){
				return await http.post(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
		del: {
			url: `${config.API_URL}/menu/del`,
			name: "删除菜单",
			delete: async function(params){
				return await http.delete(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
		sort: {
			url: `${config.API_URL}/menu/sort`,
			name: "菜单排序",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	},
	dic: {
		tree: {
			url: `${config.API_URL}/dic/tree`,
			name: "获取字典树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/dic/list`,
			name: "字典明细",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		saveType: {
			url: `${config.API_URL}/dic/saveType`,
			name: "保存字典类型",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delType: {
			url: `${config.API_URL}/dic/delType`,
			name: "删除字典类型",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		delBatch: {
			url: `${config.API_URL}/dic/delBatch`,
			name: "删除字典",
			delete: async function(params){
				return await http.delete(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
		del: {
			url: `${config.API_URL}/dic/del`,
			name: "删除字典",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL}/dic/save`,
			name: "保存字典",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		sort: {
			url: `${config.API_URL}/dic/sort`,
			name: "字典排序",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		changeStatus: {
			url: `${config.API_URL}/dic/changeStatus`,
			name: "修改字典状态",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/system/dic/get`,
			name: "获取字典数据",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	role: {
		list: {
			url: `${config.API_URL}/role/list`,
			name: "获取角色列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL}/role/save`,
			name: "保存角色",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		del: {
			url: `${config.API_URL}/role/del`,
			name: "删除角色",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		delBatch: {
			url: `${config.API_URL}/role/delBatch`,
			name: "删除角色",
			delete: async function(params){
				return await http.delete(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
		changeStatus: {
			url: `${config.API_URL}/role/changeStatus`,
			name: "修改角色状态",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	},
	dept: {
		list: {
			url: `${config.API_URL}/system/dept/list`,
			name: "获取部门列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	user: {
		list: {
			url: `${config.API_URL}/system/user/list`,
			name: "获取用户列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL}/user/save`,
			name: "保存用户",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		changePassword: {
			url: `${config.API_URL}/auth/changePassword`,
			name: "修改密码",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	},
	app: {
		list: {
			url: `${config.API_URL}/system/app/list`,
			name: "应用列表",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	log: {
		all: {
			url: `${config.API_URL}/log/allLog`,
			name: "日志列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		list: {
			url: `${config.API_URL}/log/userLog`,
			name: "日志列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	table: {
		list: {
			url: `${config.API_URL}/system/table/list`,
			name: "表格列管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		info: {
			url: `${config.API_URL}/system/table/info`,
			name: "表格列管理详情",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	tasks: {
		list: {
			url: `${config.API_URL}/system/tasks/list`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
