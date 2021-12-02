/*
 * @Author: daipeng7
 * @Date: 2021-07-07 20:04:23
 * @LastEditTime: 2021-09-29 16:19:08
 * @LastEditors: daipeng7
 * @Description: 请求配置
 */
import {
	FetchConfig, ResponseStatusType, ResponseType, FetchItemIndex, FetchMethod,
	FetchCore,
	FetchResponse,
} from '@/plugins/fetch';

const errorMessage = (res: FetchResponse) => {
	window?.$message?.error(res?.data?.message || res.statusText, {
		duration: 3000,
	});
	return Promise.reject(res);
};

// 请求响应状态码
enum FetchCode {
	SUCCESS 				= 0,
	FAIL					= 1,
	SERVER_SUCCESS			= 200,
	// 验证码错误
	CAPTCHA_ERROR			= 101,
	// 登录失效
	UNAUTHORIZED			= 401,
	// 账号或密码错误
	LOGIN_PARAMS_ERROR		= 403,
	// 未知接口
	NOT_FOUND				= 404,
	// 参数错误
	PARAMS_ERROR			= 422,
	// 系统服务错误
	SERVER_ERROR			= 500,
	// 服务网关出错
	SERVER_BAD_GATEWAY		= 502,
	// 请求超时
	SERVER_GATEWAY_TIMEOUT	= 504
}

// 名称
export const FETCH_NAME = 'fetch';
// 别名
export const FETCH_ALIAS = '$fetch';
// 接口别名
export enum apiAlias {
	USER_INFO		=	'getUserInfo',
	LOGIN			= 	'login',
	LOGOUT			= 	'logout',
	LOGON			=	'register',
	CAPTCHA			= 	'captcha',
	// 角色
	SEARCH_ROLE		= 	'searchRole',
	ADD_ROLE		=	'addRole',
	UPDATE_ROLE		=	'updateRole',
	STATUS_ROLE		= 	'statusRole',
	// 用户
	SEARCH_USER		= 	'searchUser',
	ADD_USER		=	'addUser',
	UPDATE_USER		=	'updateUser',
	STATUS_USER		= 	'statusUser',
	// 菜单
	SEARCH_MENU		= 	'searchMenu',
	HIDDEN_MENU		=	'hiddenMenu',
	KEEPALIVE_MENU	=	'keepAliveMenu',
	ADD_MENU		=	'addMenu',
	UPDATE_MENU		=	'updateMenu',
}

// 接口索引配置
export const httpItems: FetchItemIndex = {
	[apiAlias.USER_INFO]: { method: FetchMethod.GET, path: 'user/info' },
	[apiAlias.LOGOUT]:	{ method: FetchMethod.GET, path: 'user/logout' },
	[apiAlias.LOGON]: { method: FetchMethod.POST, path: 'public/register' },
	[apiAlias.LOGIN]: { method: FetchMethod.POST, path: 'public/login' },
	[apiAlias.CAPTCHA]: { method: FetchMethod.GET, path: 'public/captcha' },
	// 角色
	[apiAlias.SEARCH_ROLE]: { method: FetchMethod.GET, path: 'role/get' },
	[apiAlias.ADD_ROLE]: { method: FetchMethod.POST, path: 'role/add' },
	[apiAlias.UPDATE_ROLE]: { method: FetchMethod.POST, path: 'role/update' },
	[apiAlias.STATUS_ROLE]: { method: FetchMethod.POST, path: 'role/status' },
	// 用户
	[apiAlias.SEARCH_USER]: { method: FetchMethod.GET, path: 'user/get' },
	[apiAlias.ADD_USER]: { method: FetchMethod.POST, path: 'user/add' },
	[apiAlias.UPDATE_USER]: { method: FetchMethod.POST, path: 'user/update' },
	[apiAlias.STATUS_USER]: { method: FetchMethod.POST, path: 'user/status' },
	// 菜单
	[apiAlias.SEARCH_MENU]: { method: FetchMethod.GET, path: 'menu/get' },
	[apiAlias.HIDDEN_MENU]: { method: FetchMethod.POST, path: 'menu/hidden' },
	[apiAlias.KEEPALIVE_MENU]: { method: FetchMethod.POST, path: 'menu/keepAlive' },
	[apiAlias.ADD_MENU]: { method: FetchMethod.POST, path: 'menu/add' },
	[apiAlias.UPDATE_MENU]: { method: FetchMethod.POST, path: 'menu/update' },
};

// 请求配置
const httpConfig: FetchConfig = {
	name: FETCH_NAME,
	alias: FETCH_ALIAS,
	provide: true,
	base: {
		baseURL: '/api/v1',
		responseType: 'json',
	},
	status: {
		[FetchCode.SUCCESS]: { type: ResponseType.CUSTOM, statusType: ResponseStatusType.SUCCESS, relogin: false, returnAllData: false },
		[FetchCode.FAIL]: { type: ResponseType.CUSTOM, statusType: ResponseStatusType.ERROR, relogin: false, returnAllData: false, errorCallback: errorMessage },
		[FetchCode.SERVER_SUCCESS]: { type: ResponseType.SERVER, statusType: ResponseStatusType.SUCCESS, relogin: false, returnAllData: false },
		[FetchCode.SERVER_ERROR]: { type: ResponseType.SERVER, statusType: ResponseStatusType.ERROR, relogin: false, returnAllData: false },
		[FetchCode.NOT_FOUND]: { type: ResponseType.SERVER, statusType: ResponseStatusType.ERROR, relogin: false, returnAllData: false },
		[FetchCode.UNAUTHORIZED]: { type: ResponseType.CUSTOM, statusType: ResponseStatusType.ERROR, relogin: '/login', returnAllData: false },
		[FetchCode.CAPTCHA_ERROR]: { type: ResponseType.CUSTOM, statusType: ResponseStatusType.ERROR, relogin: false, returnAllData: false, errorCallback: errorMessage },
	},
	items: httpItems,
};

// 自定义组件中的类型
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		[FETCH_ALIAS]: FetchCore
	}
}

export default httpConfig;
