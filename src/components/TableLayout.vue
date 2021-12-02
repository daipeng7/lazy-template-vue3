<!--
 * @Author: daipeng7
 * @Date: 2021-08-17 11:48:14
 * @LastEditTime: 2021-08-24 16:47:28
 * @LastEditors: daipeng7
 * @Description: 常用table
-->
<template>
	<div class="table-layout">
		<div v-if="showSearch" ref="searchRef" class="form-wrap">
			<slot name="search" />
		</div>
		<div ref="tableRef" class="table-wrap" :style="{height: `${tableHeight}px`}">
			<slot name="table" :height="tableHeight" />
		</div>
		<div v-if="showPagination" ref="paginationRef" class="pagination-wrap">
			<n-pagination
				v-model:page="p.page"
				v-model:page-size="p.pageSize"
				:page-count="p.pageCount"
				:show-size-picker="p.showSizePicker"
				:page-sizes="p.pageSizes"
			/>
		</div>
	</div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, Ref, watchEffect } from 'vue';
import { NPagination } from 'naive-ui';
import { useStore } from '@/store';

export default defineComponent({
	name: 'TableLayout',
	components: { NPagination },
	props: {
		height: { type: Number, default: 0 },
		showPagination: { type: Boolean, default: false },
		pagination: { type: Object, default: () => ({}) },
	},
	setup(props, context) {
		const store = useStore();
		const viewHeight = computed(() => store.getters['app/mainHeight']);
		const p = reactive({
			page: 1,
			pageSize: 30,
			pageCount: 1,
			showSizePicker: true,
			pageSizes: [30, 60, 90, 120],
			...props.pagination,
		});

		const searchRef = ref(null);
		const tableRef = ref(null);
		const paginationRef = ref(null);
		const tableHeight = ref(0);
		const showSearch = ref(!!context.slots.search);

		// 计算table 高度
		watchEffect(() => {
			const searchDOM = searchRef.value || { clientHeight: 0 };
			const paginationDOM = paginationRef.value || { clientHeight: 0 };
			const tableHeadDOM = document.querySelector('.n-data-table-thead') || { clientHeight: 35 };
			tableHeight.value = viewHeight.value - searchDOM.clientHeight - paginationDOM.clientHeight - tableHeadDOM.clientHeight;
		}, { flush: 'post' });

		return {
			p,
			searchRef,
			tableRef,
			paginationRef,
			tableHeight,
			showSearch,
		};
	},
});
</script>
<style lang="scss" scoped>
	.table-layout{
		height: 100%;
		box-sizing: border-box;
		padding: 5px;
		.form-wrap{
			padding: 5px 0 10px;
		}
		.table-wrap{
			height: 100%;
		}
		.pagination-wrap{
			padding: 5px 0;
			@include flex(row, center, center)
		}
	}
</style>
