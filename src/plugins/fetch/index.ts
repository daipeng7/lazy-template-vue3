/*
 * @Author: daipeng7
 * @Date: 2021-07-07 17:53:06
 * @LastEditTime: 2021-09-02 09:26:02
 * @LastEditors: daipeng7
 * @Description: 请求插件,核心依赖为axios
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
	App, reactive, Ref, toRefs,
} from 'vue';

// 响应类型
export enum ResponseType { CUSTOM, SERVER }

// 响应状态类型
export enum ResponseStatusType { SUCCESS, ERROR }

// 请求方法
export enum FetchMethod {
	GET		= 'GET',
	POST	= 'POST',
	PUT		= 'PUT',
	DELETE	= 'DELETE',
	OPTIONS	= 'OPTIONS',
	PATCH 	= 'PATCH',
	HEAD	= 'HEAD'
}

// 请求配置基础
export type FetchConfigBase = AxiosRequestConfig

// 请求响应数据体类型
export interface FetchResponseData {
	data: any
	status: number
	message: string
}

export interface FetchResponse<T = FetchResponseData> extends AxiosResponse<T> {
	data: T
}

// hook式数据响应类型
export interface UseFetchHookResponse {
	run: () => Promise<void>
	loading: Ref<boolean>
	success: Ref<boolean>
	fail: Ref<boolean>
	data: Ref<FetchResponseData>
}

// 核心请求方法
export interface FetchCore {
	<T = any, R = FetchResponseData>(apiKey: number | string, data?: T, config?: AxiosRequestConfig): Promise<R>
}

/** ************* 状态 start ***************** */
// 请求状态操作配置
export interface FetchStatus {
	// 响应类型
	type: ResponseType
	// 响应状态类型
	statusType: ResponseStatusType
	// 是否重新登录, 登录路由名称
	relogin: boolean | string
	// 返回所有数据，如果为false 只返回data部分，默认为false
	returnAllData: false
	// 自定义响应信息
	customMessage?: string,
	// 自定义处理错误信息
	errorCallback?: (res: FetchResponse) => Promise<any>
	// 自定义处理成功信息
	successCallback?: (res: FetchResponse | FetchResponseData) => Promise<any>
}

// 请求状态操作配置索引
export interface FetchStatusIndex {
	[index: number]: FetchStatus
}

/** ************* 状态 end ***************** */

/** ************* 请求体相关 start ***************** */
// 请求别名
export type FetchAlias = string | number

// 请求主体
export interface FetchItem {
	method: FetchMethod
	path: string
}
// 请求主体索引, 只读
export interface FetchItemIndex {
	readonly [index: string]: FetchItem
	readonly [index: number]: FetchItem
}
/** ************* 请求体相关 end ***************** */

/** ************* 配置相关 start ***************** */
// 前置请求配置
export interface FetchConfigPrev {
	// 是否开启前置请求配置
	prevFetchEnable: boolean | true
	// 执行前置请求列表中配置的方式
	prevFetchExecMode: 'parallel' | 'serial'
	// 前置请求列表
	prevFetchList: string[]
}

// 请求配置
export interface FetchConfig {
	// 请求实例名称
	name: string
	// 请求实例别名,用于挂载到实例原型链中
	alias: string
	// 是否挂载到原型链上供所有vue实例使用,alias设置的情况下生效
	provide?: boolean | true
	// 请求实例基础配置，axios配置
	base: FetchConfigBase
	// 请求响应状态索引
	status: FetchStatusIndex
	// 前置执行配置
	prev?: FetchConfigPrev
	// 请求主体索引配置
	items: FetchItemIndex
	// 错误回调
	errorCallback?: (error: any) => Promise<any> | any
	// 成功回调
	successCallback?: (res: FetchResponse) => Promise<any> | any
}
/** ************* 配置相关 end ***************** */

// 请求调用方法封装
export const fetchWrap = (instance: AxiosInstance, options: FetchConfig): FetchCore => {
	const { base, items } = options;
	return (apiKey: number | string, data: any = {}, config: AxiosRequestConfig = {}) => {
		const fetchItem = items[apiKey];
		if (!fetchItem) {
			const err = new Error(`request: ${apiKey} is not online`);
			console.error(err);
			return Promise.reject(err);
		}
		const { method, path } = fetchItem;

		const cfg = {
			method, url: path, data, ...config,
		};
		if (method === FetchMethod.GET) cfg.params = data;
		else cfg.data = data;

		return instance.request(cfg);
	};
};

// 业务级请求方法
// eslint-disable-next-line import/no-mutable-exports
export let fetch: FetchCore;

// 请求hook方法
export const useFetch = (apiKey: number | string, data: any = {}, config: AxiosRequestConfig = {}): UseFetchHookResponse => {
	const state = reactive({
		data: {},
		fail: false,
		success: false,
		loading: false,
	});
	const run = async () => {
		let result;
		state.fail = false;
		state.success = false;
		state.loading = true;
		try {
			result = await fetch(apiKey, data, config);
			state.data = result;
			state.success = true;
		} catch (error) {
			state.fail = true;
		}
		state.loading = false;
		return result;
	};
	return <UseFetchHookResponse>{ ...toRefs(state), run };
};

// 默认的响应处理
const defaultResponseCallback = (function callbackWrap() {
	// 解析自定义数据
	const custormResponseResolve = (res: FetchResponse, statusType: ResponseStatusType, statusItem: FetchStatus): Promise<any> => {
		if (statusType === ResponseStatusType.SUCCESS) {
			const data = statusItem.returnAllData ? res : res.data;
			// 单个请求的成功处理
			return statusItem.successCallback ? statusItem.successCallback(data) : Promise.resolve(data);
		}
		if (statusType === ResponseStatusType.ERROR) {
			// 单个请求的错误处理
			return statusItem.errorCallback ? statusItem.errorCallback(res) : Promise.reject(res);
		}
		return Promise.reject(new Error('unexpected to response'));
	};

	return (res: FetchResponse, statusIndex: FetchStatusIndex): (any | Promise<any>) => {
		const { data, status, statusText } = res;
		const statusItem: FetchStatus = statusIndex[status];
		if (!statusItem) return res;
		const {
			type, relogin = false, statusType, returnAllData = false,
		} = statusItem;
		// 1、服务端响应类型
		if (type === ResponseType.SERVER) {
			// 如果服务端响应成功，需要再次解析自定义响应状态
			if (statusType === ResponseStatusType.SUCCESS) {
				const statusItem = statusIndex[res.data.status];
				return custormResponseResolve(res, statusItem.statusType, statusItem);
			} if (statusType === ResponseStatusType.ERROR) {
			// 单个请求的错误处理
				return statusItem.errorCallback ? statusItem.errorCallback(res) : Promise.reject(res);
			}
		}
		// 2、自定义响应类型
		if (type === ResponseType.CUSTOM) {
			return custormResponseResolve(res, statusType, statusItem);
		}

		return res;
	};
}());

// 安装fetch插件实例
export const install = (app: App, options: FetchConfig): AxiosInstance => {
	const {
		base, status: statusMap, name, alias, provide,
		successCallback, errorCallback,
	} = options;

	// 1、创建实例
	const instance = axios.create(base);

	// 2、请求拦截器
	instance.interceptors.request.use((config: AxiosRequestConfig) => ({ ...config }), (error) => Promise.reject(error));

	// 3、响应拦截器
	instance.interceptors.response.use((response: FetchResponse) => {
		/** ** 全局成功响应逻辑 *** */
		// 1、自定义处理
		if (successCallback) return successCallback(response);
		// 2、默认处理
		return defaultResponseCallback(response, statusMap);
	}, (error) => {
		/** ** 全局失败响应逻辑 *** */
		// 1、自定义处理
		if (errorCallback) return errorCallback(error);
		// 2、默认处理
		return defaultResponseCallback(error.response, statusMap);
	});

	/** ** 实例外抛 *** */
	const fetchHandler = fetchWrap(instance, options);
	// 1、挂载到原型链上
	if (provide && alias) app.config.globalProperties[alias] = fetchHandler;
	// 2、加入到export中，同时可以被useFetch hook使用
	fetch = fetchHandler;

	return instance;
};

export default {
	install,
	fetchWrap,
};
