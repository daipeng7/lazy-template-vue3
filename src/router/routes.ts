/*
 * @Author: daipeng7
 * @Date: 2021-07-07 16:36:48
 * @LastEditTime: 2021-08-17 09:59:56
 * @LastEditors: daipeng7
 * @Description: 路由配置
 */
import { RouteRecordRaw } from 'vue-router';
import App from '@/App.vue';

export const adminRoutes = [
	{
		name: 'adminHome',
		path: 'home',
		meta: {
			title: '首页',
			icon: 'ift-home',
			keepAlive: true,
		},
		component: () => import('@/views/Admin/Home.vue'),
	},
	{
		name: 'adminPermission',
		path: 'permission',
		meta: {
			title: '权限管理',
			icon: 'ift-permission',
			keepAlive: true,
		},
		redirect: { name: 'permissionRole' },
		component: () => import('@/views/RouterView.vue'),
		children: [
			{
				name: 'permissionRole',
				path: 'role',
				meta: {
					title: '角色管理',
					icon: 'ift-role',
					keepAlive: true,
				},
				component: () => import('@/views/Admin/Permission/Role.vue'),
			},
			{
				name: 'permissionUser',
				path: 'user',
				meta: {
					title: '用户管理',
					icon: 'ift-user',
					keepAlive: true,
				},
				component: () => import('@/views/Admin/Permission/User.vue'),
			},
			{
				name: 'permissionMenu',
				path: 'menu',
				meta: {
					title: '菜单管理',
					icon: 'ift-menu',
					keepAlive: true,
				},
				component: () => import('@/views/Admin/Permission/Menu.vue'),
			},
		],
	},
];

export const rootRoutes: RouteRecordRaw[] = [
	{
		name: 'app',
		path: '/',
		component: App,
		children: [
			{
				name: 'login',
				path: 'login',
				component: () => import('@/views/Login.vue'),
			},
			{
				name: 'register',
				path: 'register',
				component: () => import('@/views/Register.vue'),
			},
			{
				name: 'admin',
				path: 'admin',
				component: () => import('@/views/Admin/Index.vue'),
				redirect: { name: 'adminHome' },
				children: adminRoutes,
			},
		],
	},
];

export default {
	rootRoutes,
	adminRoutes,
};
