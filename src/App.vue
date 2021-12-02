<template>
	<n-config-provider :locale="locale" :date-locale="dateLocale" :theme-overrides="themeOverrides">
		<n-dialog-provider>
			<div class="layout" :style="layoutStyle">
				<div v-if="validating || loggingIn" class="layout-loading">
					<span>loading....</span>
				</div>
				<router-view />
			</div>
		</n-dialog-provider>
	</n-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { NConfigProvider, NDialogProvider, zhCN, dateZhCN, useMessage } from 'naive-ui';
import { LoginStatus } from '@/store/type';
import { useStore } from '@/store';

export default defineComponent({
	name: 'App',
	components: { NConfigProvider, NDialogProvider },
	setup(props, context) {
		const store = useStore();

		const validating = computed(() => store.state.app.loginStatus === LoginStatus.Validating);
		const loggingIn = computed(() => store.state.app.loginStatus === LoginStatus.LoggingIn);

		window.$message = useMessage();

		store.dispatch('app/onResizeWindow');
		// store.dispatch('app/getUserInfo');

		const layoutStyle = computed(() => {
			const { width, height } = toRefs(store.state.app.layout);
			return {
				width: `${width.value}px`,
				height: `${height.value}px`,
			};
		});

		const themeOverrides = computed(() => store.state.app.theme);
		return {
			layoutStyle,
			validating,
			loggingIn,
			locale: zhCN,
			dateLocale: dateZhCN,
			themeOverrides,
		};
	},
});
</script>

<style lang="scss">
.layout {
	overflow: auto;
	position: relative;
	.layout-loading{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 9999;
		background-color: rgba(0, 0, 0, 0.3);
		@include flex(row, center, center);
	}
}
</style>
