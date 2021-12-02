<!--
 * @Author: daipeng7
 * @Date: 2021-07-19 10:32:35
 * @LastEditTime: 2021-09-23 14:46:03
 * @LastEditors: daipeng7
 * @Description: header
-->
<template>
	<div class="header-panel">
		<n-breadcrumb class="header-breadcrumb" separator="/">
			<n-breadcrumb-item v-for="item in routes" :key="item.name" :to="{ name: item.name }">{{ item.meta.title }}</n-breadcrumb-item>
		</n-breadcrumb>
		<div class="header-opration">
			<div class="user-avatar">
				<n-avatar round size="small" object-fit="cover" :src="user.avatar">
					<template #default><i class="ift-avatar" /></template>
				</n-avatar>
			</div>
			<div class="user-name">
				<n-dropdown trigger="hover" size="medium" :options="dropdownOptions" @select="onSelectDropdown">
					<div class="user-name-wrap">
						<span class="">{{ user.name }}</span>
						<i class="ift-setting" />
					</div>
				</n-dropdown>
			</div>
		</div>
	</div>
	<div class="header-tags">
		<div class="tags-scroll">
			<div v-for="item in histories" :key="item.name" :class="['view-tag', route.name === item.name ? 'dark' : 'plain']" @click.stop="onClickHistory(item)">
				<span>{{ item.meta.title }}</span><i class="tag-close ift-close" @click.stop="onRemoveHistory(item)" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watchEffect } from 'vue';
import { LocationQuery, RouteMeta, RouteParams, RouteRecordName, useRoute, useRouter, RouteLocationRaw } from 'vue-router';
import { NBreadcrumb, NBreadcrumbItem, NAvatar, NDropdown } from 'naive-ui';

import utils from '@/utils';
import { useStore } from '@/store';

type SimpleRoute = {
	name: RouteRecordName | undefined,
	params?: RouteParams,
	query?: LocationQuery
	meta: RouteMeta
}

const HISTORY = 'history';

export default defineComponent({
	name: 'IndexHeader',
	components: { NBreadcrumb, NBreadcrumbItem, NAvatar, NDropdown },
	setup() {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const l = window.sessionStorage.getItem(HISTORY) || '[]';
		const histories: SimpleRoute[] = reactive(JSON.parse(l));

		watchEffect(() => {
			if (!histories.find((i) => i.name === route.name)) {
				histories.push({
					name: route.name || '',
					params: route.params,
					query: route.query,
					meta: route.meta,
				});
				window.sessionStorage.setItem(HISTORY, JSON.stringify(histories));
			}
		});

		const routes = computed(() => route.matched.reduce((list: SimpleRoute[], match) => {
			if (match.meta.title) list.push({ name: match.name, meta: match.meta });
			return list;
		}, []));

		const user = computed(() => {
			const { avatar, name, uuid, id } = store.state.app.userInfo;
			return {
				name, uuid, id, avatar: utils.depend.fullSrc(avatar),
			};
		});

		const dropdownOptions = reactive([
			{ label: '退出', key: 'logout' },
		]);

		// 设置
		const onSelectDropdown = (key: string) => {
			if (key === 'logout') store.dispatch('app/logout');
		};

		// 点击历史
		const onClickHistory = (tag: SimpleRoute) => {
			router.replace(<RouteLocationRaw>tag);
		};

		// 移除历史
		const onRemoveHistory = (tag: SimpleRoute) => {
			const rmIndex = histories.findIndex((i) => i === tag);
			const isCurrentRoute = tag.name === route.name;
			let newCurrentRoute: SimpleRoute | undefined;
			const len = histories.length;
			// 删除tag为当前路由
			if (isCurrentRoute) {
				if (rmIndex === 0 && len >= 2) {
					newCurrentRoute = { ...histories[1] };
				} else if (rmIndex === len - 1 && len >= 2) {
					newCurrentRoute = histories[histories.length - 2];
				} else {
					newCurrentRoute = histories[rmIndex + 1];
				}
			}
			histories.splice(rmIndex, 1);
			window.sessionStorage.setItem(HISTORY, JSON.stringify(histories));
			if (newCurrentRoute) router.replace(newCurrentRoute);
		};

		return {
			route,
			user,
			routes,
			histories,
			dropdownOptions,
			onSelectDropdown,
			onClickHistory,
			onRemoveHistory,
		};
	},
});
</script>

<style lang="scss" scoped>
	.header-panel{
		width: 100%;
		height: 60%;
		box-sizing: border-box;
		padding: 0 10px;
		border-bottom: 1px solid color(light);
		@include flex(row, space-between, center);
		.header-breadcrumb{
		}
		.header-opration{
			@include flex(row, center, center);
			.user-avatar{
				width: 32px;
				height: 32px;
				border-radius: 50%;
				overflow: hidden;
				border-radius: 50%;
				background-color: color(light);
				@include flex(row, center, center);
			}
			.user-name{
				padding: 0 10px;
				.user-name-wrap{
					font-size: 14px;
					cursor: pointer;
					@include flex(row, center, center);
					i{
						margin-left: 5px;
					}
				}
			}
		}
	}
	.header-tags{
		width: 100%;
		height: 40%;
		box-sizing: border-box;
		border-bottom: 1px solid color(light);
		.tags-scroll{
			height: 100%;
			@include flex(row, flex-start, center);
			.view-tag{
				font-size: 12px;
				height: 100%;
				padding: 0 10px;
				border-right: 1px solid color(light);
				cursor: pointer;
				@include flex(row, center, center);
				@mixin activeTag{
					width: auto;
					font-size: 14px;
					margin-left: 5px;
				}
				.tag-close{
					@include activeTag;
					transition: all 0.1s;
				}
				&.plain{
					color: color(primary);
					.tag-close{
						width: 0px;
						font-size: 0;
						margin-left: 0;
					}
					&:hover{
						.tag-close{
							@include activeTag;
						}
					}
				}
				&.dark{
					color: color(white);
					background-color: color(primary);
					.tag-close{
						@include activeTag;
					}
				}
			}
		}
	}
</style>
