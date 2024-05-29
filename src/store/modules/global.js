import config from "@/config";

export default {
	state: {
		//移动端布局
		ismobile: false,
		//布局
		layout: config.LAYOUT,
		//菜单是否折叠 toggle
		menuIsCollapse: config.MENU_IS_COLLAPSE,
		//多标签栏
		layoutTags: config.LAYOUT_TAGS,
		//主题
		theme: config.THEME,
		//用户信息
		userInfo: JSON.parse(localStorage.getItem('USER_INFO_USER')) || {}
	},
	mutations: {
		SET_ismobile(state, key){
			state.ismobile = key
		},
		SET_layout(state, key){
			state.layout = key
		},
		SET_theme(state, key){
			state.theme = key
		},
		TOGGLE_menuIsCollapse(state){
			state.menuIsCollapse = !state.menuIsCollapse
		},
		TOGGLE_layoutTags(state){
			state.layoutTags = !state.layoutTags
		},
		SET_USER_INFO(state, userInfo) {
			state.userInfo = userInfo;
		}
	},
	actions: {
		setUserInfo({ commit }, userInfo) {
			commit('SET_USER_INFO', userInfo);
			localStorage.setItem('USER_INFO_USER', JSON.stringify(userInfo));
		}
	},
	getters: {
		userInfo: state => state.userInfo
	}
}
