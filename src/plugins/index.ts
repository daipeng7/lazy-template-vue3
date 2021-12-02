/*
 * @Author: daipeng7
 * @Date: 2021-07-07 11:01:31
 * @LastEditTime: 2021-08-17 11:33:59
 * @LastEditors: daipeng7
 * @Description: 插件
 */
import { App, Plugin } from 'vue';
import fetchPlugin from '@/plugins/fetch';
import config from '@/config';

export interface PluginItem {
	plugin: Plugin,
	options: any[] | []
}

// 插件列表
export const globalPlugins: Array<PluginItem> = [
	// 请求插件
	{ plugin: fetchPlugin, options: [config.http] },
];

/**
 * @description: 安装插件
 * @param {App} app
 * @param {PluginItem} list
 * @return {void}
 */
export const installPlugin = (app: App, list: PluginItem[] = globalPlugins) => {
	list.forEach((item) => {
		app.use(item.plugin, ...item.options);
	});
};

export default {
	globalPlugins,
	installPlugin,
};
