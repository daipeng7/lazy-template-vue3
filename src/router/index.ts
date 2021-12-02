/*
 * @Author: daipeng7
 * @Date: 2021-07-07 16:37:05
 * @LastEditTime: 2021-08-13 22:51:14
 * @LastEditors: daipeng7
 * @Description: 路由
 */
import { App } from 'vue';
import { createRouter, createWebHistory, Router } from 'vue-router';
import { rootRoutes } from '@/router/routes';

// 路由实例
export const router = createRouter({
	history: createWebHistory('/'),
	routes: rootRoutes,
});

/**
 * @description: 安装路由
 * @param {App} app
 * @param {Router} _router
 * @return {*}
 */
export const installRouter = (app: App, _router: Router = router) => {
	_router.afterEach((to, from, failure) => {

	});
	app.use(_router);
};

export default {
	installRouter,
};
