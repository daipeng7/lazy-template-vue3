/*
 * @Author: daipeng7
 * @Date: 2021-07-19 11:35:10
 * @LastEditTime: 2021-08-16 11:56:38
 * @LastEditors: daipeng7
 * @Description: 管理后台store module
 */
import { Module } from 'vuex';
import { adminRoutes } from '@/router/routes';
import { AdminState, RootState } from '@/store/type';

const adminModule: Module<AdminState, RootState> = {
	namespaced: true,
	state: () => ({
		menuList: [],
	}),
	mutations: {
		setMenuList(state, menuList = []) {
			state.menuList = menuList;
		},
	},
	actions: {
		// 初始化导航栏
		getMenuList({ commit, state, rootState }) {
			// console.log(rootState.app.userInfo);
			commit('setMenuList', adminRoutes);
		},
	},
};

export default adminModule;
