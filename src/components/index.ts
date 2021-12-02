/*
 * @Author: daipeng7
 * @Date: 2021-07-06 17:21:42
 * @LastEditTime: 2021-08-17 11:33:05
 * @LastEditors: daipeng7
 * @Description: 组件
 */

import { Component, App } from 'vue';

export interface ComponentItem {
	name: string | undefined
	component: Component
}

// 全局组件列表
export const globalComponents: Array<ComponentItem> = [];

/**
 * @description: 安装组件
 * @param {App} app
 * @param {ComponentItem} list
 * @return {void}
 */
export const installComponent = (app: App, list: ComponentItem[] = globalComponents) => {
	list.forEach((c) => {
		if (c.name) app.component(c.name, c.component);
		else console.error(new Error('component`s name is missing'));
	});
};

export default {
	globalComponents,
	installComponent,
};
