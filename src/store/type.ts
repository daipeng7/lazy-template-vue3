/*
 * @Author: daipeng7
 * @Date: 2021-07-13 09:16:31
 * @LastEditTime: 2021-08-17 10:48:49
 * @LastEditors: daipeng7
 * @Description: 声明文件
 */
import { InjectionKey } from 'vue';
import { Store } from 'vuex';
import { RouteRecordRaw } from 'vue-router';
import SiteConfig from '@/config/site';

export enum LoginStatus {
	// 登录中
	LoggingIn,
	// 登录成功
	Logined,
	// 登录退出
	Logout,
	// 校验登录状态
	Validating,
	// 登录失败
	LoginFail
}

type Record<K extends keyof any, T> = {
    [P in K]: T;
};

type UserInfo = Record<string, any>

// {
// 	[index:string]: any
// }
// app 模块state
export interface AppState {
	layout: {
		width: number
		height: number
		menuWidth: number
		headerHeight: number,
		footerHeight: number
	},
	loginStatus: LoginStatus
	userInfo: UserInfo,
	siteConfig: typeof SiteConfig,
	theme: import('naive-ui').GlobalThemeOverrides
}

// 管理模块
export interface AdminState {
	menuList: RouteRecordRaw[]
}

// 根节点state
export interface RootState {
	app: AppState
	admin: AdminState
}

// store key
export type Key = InjectionKey<Store<RootState>>;
