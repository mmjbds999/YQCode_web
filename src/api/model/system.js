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
		},
		getMenuIdsByRoleId: {
			url: `${config.API_URL}/menu/getMenuIdsByRoleId`,
			name: "获取当前角色的菜单ids",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
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
		},
		getDicByTypeCode: {
			url: `${config.API_URL}/dic/getDicByTypeCode`,
			name: "根据字典类型获取字典数据",
			get: async function(params){
				return await http.get(this.url, params)
			}
		},
		getDicChild: {
			url: `${config.API_URL}/dic/getDicChild`,
			name: "根据字典类型获取字典数据",
			get: async function(params){
				return await http.get(this.url, params)
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
		allUsed: {
			url: `${config.API_URL}/role/allUsed`,
			name: "获取所有启用的角色列表",
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
		},
		getRoleById: {
			url: `${config.API_URL}/role/getRoleById`,
			name: "根据id获取角色",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		permissions: {
			url: `${config.API_URL}/role/permissions`,
			name: "角色授权",
			post: async function(params){
				return await http.post(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		}
	},
	org: {
		list: {
			url: `${config.API_URL}/org/list`,
			name: "获取组织列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL}/org/save`,
			name: "保存组织",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		del: {
			url: `${config.API_URL}/org/del`,
			name: "删除组织",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		delBatch: {
			url: `${config.API_URL}/org/delBatch`,
			name: "删除组织",
			delete: async function(params){
				return await http.delete(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		}
	},
	user: {
		list: {
			url: `${config.API_URL}/user/list`,
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
		sysSave: {
			url: `${config.API_URL}/user/sysSave`,
			name: "保存用户",
			post: async function(data){
				return await http.post(this.url, data)
			}
		},
		changeStatus: {
			url: `${config.API_URL}/user/changeStatus`,
			name: "修改用户状态",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		changePassword: {
			url: `${config.API_URL}/auth/changePassword`,
			name: "修改密码",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		del: {
			url: `${config.API_URL}/user/del`,
			name: "删除用户",
			delete: async function(params){
				return await http.delete(this.url, params)
			}
		},
		delBatch: {
			url: `${config.API_URL}/user/delBatch`,
			name: "批量删除用户",
			delete: async function(params){
				return await http.delete(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
		resetPassword: {
			url: `${config.API_URL}/user/resetPwdBatch`,
			name: "重置密码-批量",
			post: async function(params){
				return await http.post(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
	},
	resource: {
		list: {
			url: `${config.API_URL}/resource/all`,
			name: "获取资源列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		getRoleResources: {
			url: `${config.API_URL}/resource/getRoleResources`,
			name: "获取角色资源",
			get: async function(params){
				return await http.get(this.url, params);
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
	modType: {
		list: {
			url: `${config.API_URL}/modType/list`,
			name: "模块类型列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		tree: {
			url: `${config.API_URL}/modType/tree`,
			name: "模块类型树",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/modType/get`,
			name: "根据id获取模块类型",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL}/modType/save`,
			name: "保存模块类型",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		del: {
			url: `${config.API_URL}/modType/del`,
			name: "删除模块类型",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		delBatch: {
			url: `${config.API_URL}/modType/delBatch`,
			name: "批量删除模块类型",
			delete: async function(params){
				return await http.delete(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		}
	},
	mod: {
		list: {
			url: `${config.API_URL}/mods/list`,
			name: "模块列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/mods/get`,
			name: "根据id获取模块",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL}/mods/save`,
			name: "保存模块",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		del: {
			url: `${config.API_URL}/mods/del`,
			name: "删除模块",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		delBatch: {
			url: `${config.API_URL}/mods/delBatch`,
			name: "批量删除模块",
			delete: async function(params){
				return await http.delete(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		}
	},
	pagesAPI: {
		list: {
			url: `${config.API_URL}/pages/list`,
			name: "页面管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/pages/get`,
			name: "根据id获取页面",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL}/pages/save`,
			name: "保存页面",
			post: async function(data){
				return await http.post(this.url, data);
			}
		},
		del: {
			url: `${config.API_URL}/pages/del`,
			name: "删除页面",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		delBatch: {
			url: `${config.API_URL}/pages/delBatch`,
			name: "批量删除页面",
			delete: async function(params){
				return await http.delete(this.url, params, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
	},
}
