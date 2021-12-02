<!--
 * @Author: daipeng7
 * @Date: 2021-07-19 10:24:43
 * @LastEditTime: 2021-08-17 17:54:56
 * @LastEditors: daipeng7
 * @Description: 管理后台入口
-->
<template>
	<div class="admin">
		<nav class="nav-wrap" :style="{ width: menuWidth, backgroundColor: menuStyle.colorInverted }">
			<IndexMenu />
		</nav>
		<section class="admin-view" :style="{ width: viewWidth, left: menuWidth }">
			<header class="header-wrap" :style="{ height: headerHeight }">
				<IndexHeader />
			</header>
			<main class="view-wrap" :style="{ height: mainHeight }">
				<router-view />
			</main>
			<footer class="footer" :style="{ height: footerHeight, lineHeight: footerHeight }">
				{{ siteConfig.siteName }}
			</footer>
		</section>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import IndexMenu from '@/views/Admin/components/IndexMenu.vue';
import IndexHeader from '@/views/Admin/components/IndexHeader.vue';
import { useStore } from '@/store';

export default defineComponent({
	name: 'AdminIndex',
	components: { IndexMenu, IndexHeader },
	setup() {
		const store = useStore();
		const siteConfig = computed(() => store.state.app.siteConfig);
		// 导航栏宽度，高度为100%
		const menuWidth = computed(() => `${store.state.app.layout.menuWidth}px`);
		// 头部高度，宽度为100%
		const headerHeight = computed(() => `${store.state.app.layout.headerHeight}px`);
		// 窗口宽度，高度为100%
		const viewWidth = computed(() => `${store.state.app.layout.width - store.state.app.layout.menuWidth}px`);
		// 窗口内容高度，宽度为100%
		const mainHeight = computed(() => `${store.getters['app/mainHeight']}px`);
		// footer高度
		const footerHeight = computed(() => `${store.state.app.layout.footerHeight}px`);
		// 菜单样式
		const menuStyle = computed(() => store.state.app.theme.Menu);

		return {
			siteConfig,
			menuStyle,
			menuWidth,
			viewWidth,
			headerHeight,
			mainHeight,
			footerHeight,
		};
	},
});
</script>

<style lang="scss" scoped>
	.admin{
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		.nav-wrap{
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			z-index: 1;
		}
		.admin-view{
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			z-index: 1;
			.header-wrap{
				width: 100%;
				background: color(white);
			}
			.view-wrap{
				width: 100%;
			}
			.footer{
				font-size: 12px;
				color: color(darker);
				text-align: center;
				background-color: color(light);
			}
		}
	}
</style>
