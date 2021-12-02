/*
 * @Author: daipeng7
 * @Date: 2021-07-07 10:41:58
 * @LastEditTime: 2021-07-07 11:33:51
 * @LastEditors: daipeng7
 * @Description: 指令
 */
import { App, Directive } from 'vue';

export interface DirectiveItem {
	name: string
	directive: Directive
}

// 全局指令列表
export const globalDirectives: Array<DirectiveItem> = [];

/**
 * @description: 安装指令
 * @param {App} app
 * @param {DirectiveItem} list
 * @return {void}
 */
export const installDirective = (app: App, list: DirectiveItem[] = globalDirectives) => {
	list.forEach((item) => {
		app.directive(item.name, item.directive);
	});
};

export default {
	globalDirectives,
	installDirective,
};
