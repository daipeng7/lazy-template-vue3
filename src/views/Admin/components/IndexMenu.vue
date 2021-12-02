<!--
 * @Author: daipeng7
 * @Date: 2021-07-19 10:32:17
 * @LastEditTime: 2021-08-17 10:43:50
 * @LastEditors: daipeng7
 * @Description: 导航
-->
<template>
	<div class="admin-nav">
		<div class="site-name" :style="{ backgroundColor: style.backgroundColor, color: style.textColor }">
			<i class="site-logo" /><span class="name-text">{{ siteConfig.siteAlias }}</span>
		</div>
		<n-menu
			class="nav-inner"
			:value="activeValue"
			:default-expanded-keys="expandedKeys"
			:options="menuOption"
			:indent="15"
			:root-indent="15"
			@update:value="onChangeMenu"
		/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watchEffect, h } from 'vue';
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router';
import { MenuGroupOption, MenuOption, NMenu } from 'naive-ui';
import { useStore } from '@/store';

const traverse = (list: RouteRecordRaw[]): Array<MenuOption | MenuGroupOption> => {
	const result: Array<MenuOption | MenuGroupOption> = list.map((route) => {
		const menuItem: MenuOption = {
			label: <string>route?.meta?.title || '',
			key: <string>route.name,
			icon: () => h('i', { class: route?.meta?.icon }),
		};
		if (route.children?.length) {
			menuItem.children = traverse(route.children);
		}

		return menuItem;
	});
	return result;
};

export default defineComponent({
	name: 'IndexMenu',
	components: { NMenu },
	props: {
		style: { type: Object, default: () => ({}) },
	},
	setup() {
		const store = useStore();
		const route = useRoute();
		const router = useRouter();
		const siteConfig = computed(() => store.state.app.siteConfig);
		const activeValue = computed(() => route.name);
		const menuOption = computed(() => traverse(store.state.admin.menuList));
		const expandedKeys: string[] = reactive([]);

		const onChangeMenu = (key: string, item: MenuOption) => {
			router.push({ name: <string>item.key });
		};

		watchEffect(() => {
			const { matched = [] } = route;
			expandedKeys.length = 0;
			matched.forEach((item) => {
				if (item?.meta?.title) expandedKeys.push(<string>item.name);
			});
		});

		return {
			activeValue,
			expandedKeys,
			siteConfig,
			menuOption,
			onChangeMenu,
		};
	},
});
</script>

<style lang="scss">
	.admin-nav{
		.site-name{
			line-height: 60px;
			text-align: center;
			.name-text{

			}
		}
		.nav-inner{

		}
		.icon {
			font-size: 16px;
			margin-right: 10px;
		}
		.el-menu{
			border: none;
		}
	}
</style>
