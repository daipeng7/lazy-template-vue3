/*
 * @Author: daipeng7
 * @Date: 2021-07-12 19:58:19
 * @LastEditTime: 2021-09-23 15:11:51
 * @LastEditors: daipeng7
 * @Description: store
 */

import { createStore, Store, useStore as useBaseStore } from 'vuex';
import { App } from 'vue';
import app from '@/store/modules/app';
import admin from '@/store/modules/admin';
import { Key, RootState } from '@/store/type';

// 创建store
export const store = createStore<RootState>({
	modules: {
		app,
		admin,
	},
});

export const key: Key = Symbol('app-store');

// 安装store
export const installStore = (app: App, _store: Store<RootState> = store) => {
	app.use(_store, key);
};

export const useStore = <S = RootState>() => useBaseStore<S>(key);

export default {
	store,
	installStore,
};
