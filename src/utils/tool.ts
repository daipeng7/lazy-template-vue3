/*
 * @Author: daipeng7
 * @Date: 2021-08-25 11:14:29
 * @LastEditTime: 2021-09-03 14:33:49
 * @LastEditors: daipeng7
 * @Description:
 */

type TreeItem<T> = {
	id: number,
	parentId: number,
	sort?: number,
	children?: Array<TreeItem<T>>
	[propName: string]: any
}

interface TreeMap<T> {
	[propName: number]: TreeItem<T>
}
interface TreeCacheMap<T> {
	[propName: number]: TreeItem<T>[]
}
/**
 * @description: 解析tree
 * @param {Array<TreeItem<T>} list
 * @return {Array<TreeItem<T>}
 */
const parseTree = <T>(list: Array<TreeItem<T>> = [], fillItem: (s: TreeItem<T>) => TreeItem<T>): Array<TreeItem<T>> => {
	const RootId = 0;
	// 默认根节点
	const treeMap: TreeMap<T> = {
		[RootId]: { id: 0, parentId: 0, children: [] },
	};
	// 因为数据顺序原因，需要将父节点还没出现的节点存起来，等遍历到父节点的时候将他插入父节点中
	const needInsertMap: TreeCacheMap<T> = {};
	const traverse = (list: Array<TreeItem<T>>) => {
		list.forEach((item) => {
			const { id, parentId, sort } = item;

			// 检查是否有子节点被暂存，有的话回填，并移除
			if (needInsertMap[id]) {
				item.children = [];
				item.children.push(...needInsertMap[id]);
				if (sort) item.children.sort((a, b) => (a.sort || 0) - (b.sort || 0));
				delete needInsertMap[id];
			}

			// 处理value值
			if (fillItem) treeMap[id] = fillItem(item);
			else treeMap[id] = item;

			// 父节点已经被收录过了，直接放入父节点的children中，并且是引用类型
			if (treeMap[parentId]) {
				if (!treeMap[parentId].children) treeMap[parentId].children = [];
				treeMap[parentId]?.children?.push(treeMap[id]);
				treeMap[parentId]?.children?.sort((a, b) => (a.sort || 0) - (b.sort || 0));
			// 父节点没有被收录过的
			// 先将改节点应用暂存
			} else if (!needInsertMap[parentId]) needInsertMap[parentId] = [treeMap[id]];
			else needInsertMap[parentId].push(treeMap[id]);
		});
	};
	traverse(list);
	return treeMap[RootId].children || [];
};

/**
 * @description: 性别转换
 * @param {number} gender
 * @return {string}
 */
const genderFormat = (gender: number) => {
	switch (gender) {
	case 1:
		return '男';
	case 2:
		return '女';
	default:
		return '';
	}
};

export default {
	parseTree,
	genderFormat,
};
