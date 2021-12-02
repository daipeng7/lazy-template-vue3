/*
 * @Author: daipeng7
 * @Date: 2021-07-12 19:58:49
 * @LastEditTime: 2021-09-23 15:17:37
 * @LastEditors: daipeng7
 * @Description: app module
 */
import debounce from 'lodash/debounce';
import { Module } from 'vuex';
import { AppState, LoginStatus, RootState } from '@/store/type';
import { fetch } from '@/plugins/fetch';
import { router } from '@/router';
import config from '@/config';
import { apiAlias } from '@/config/http';
import theme from '@/config/naive-ui-theme';

const { innerWidth, innerHeight } = window;

// {
// 	: ,
// 	textColor: '#fff',
// 	activeTextColor: '#ffd04b',
// },
const appModule: Module<AppState, RootState> = {
	namespaced: true,
	state: () => ({
		layout: {
			width: innerWidth,
			height: innerHeight,
			menuWidth: 200,
			headerHeight: 70,
			footerHeight: 30,
		},
		loginStatus: LoginStatus.Validating,
		userInfo: {},
		siteConfig: config.site,
		theme,
	}),
	getters: {
		mainHeight(state) {
			const { height, headerHeight, footerHeight } = state.layout;
			return height - headerHeight - footerHeight;
		},
	},
	mutations: {
		// 设置布局数据
		setLayout(state, payload = {}) {
			state.layout = { ...state.layout, ...payload };
		},
		// 修改登录状态
		setLoginStatus(state, status) {
			state.loginStatus = status;
		},
		// 设置用户信息
		setUserInfo(state, userInfo = {}) {
			state.userInfo = userInfo;
		},
	},
	actions: {
		// 监听窗口变化
		onResizeWindow({ commit }) {
			window.onresize = debounce((event) => {
				const { innerWidth, innerHeight } = event.currentTarget;
				commit('setLayout', { width: innerWidth, height: innerHeight });
			}, 50);
		},
		// 校验登录状态
		getUserInfo({ commit, dispatch }) {
			commit('setLoginStatus', LoginStatus.Validating);
			return fetch(apiAlias.USER_INFO).then((res) => {
				commit('setLoginStatus', LoginStatus.Logined);
				commit('setUserInfo', res.data);
				dispatch('admin/getMenuList', [], { root: true });
				if (!/^\/admin/i.test(window.location.pathname)) {
					router.replace({ name: 'admin' });
				}
			}).catch((error) => {
				const { status, data } = error;
				if ([status, data?.status].includes(401)) {
					commit('setLoginStatus', LoginStatus.Logout);
					if (!['/login', '/register'].includes(window.location.pathname)) router.replace({ name: 'login' });
				} else commit('setLoginStatus', LoginStatus.LoginFail);
			});
		},
		// 登录操作
		login({ commit, dispatch }, loginData = {}) {
			commit('setLoginStatus', LoginStatus.LoggingIn);
			return fetch(apiAlias.LOGIN, loginData).then((res) => {
				commit('setLoginStatus', LoginStatus.Logined);
				dispatch('getUserInfo');
				return res;
			}).catch((error) => {
				commit('setLoginStatus', LoginStatus.LoginFail);
				return Promise.reject(error);
			});
		},
		// 登出操作
		logout({ commit, dispatch }, loginData = {}) {
			return fetch(apiAlias.LOGOUT, loginData).then((res) => {
				commit('setLoginStatus', LoginStatus.Logout);
				dispatch('getUserInfo');
				return res;
			}).catch((error) => {
				commit('setLoginStatus', LoginStatus.LoginFail);
				return Promise.reject(error);
			});
		},
	},
};

export default appModule;
