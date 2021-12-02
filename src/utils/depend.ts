/*
 * @Author: daipeng7
 * @Date: 2021-08-10 09:59:58
 * @LastEditTime: 2021-08-10 10:36:33
 * @LastEditors: daipeng7
 * @Description: 存在依赖的方法
 */
import { store } from '@/store';

export const fullSrc = (path = ''): string => {
	const { cdn = '' } = store.state?.app?.siteConfig || {};
	if (!cdn || !path) return path;
	return cdn + path;
};

export default {
	fullSrc,
};
