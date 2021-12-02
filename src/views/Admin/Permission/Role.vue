<!--
 * @Author: daipeng7
 * @Date: 2021-08-09 16:45:24
 * @LastEditTime: 2021-09-06 11:28:58
 * @LastEditors: daipeng7
 * @Description: 角色管理
-->
<template>
	<div class="role">
		<table-layout>
			<template #search>
				<n-form ref="formRef" :model="state.search" :show-feedback="false" inline label-placement="left" size="small">
					<n-form-item label="名称" path="name">
						<n-input v-model:value="state.search.name" clearable placeholder="输入名称" />
					</n-form-item>
					<n-form-item>
						<n-button type="primary" size="tiny" @click="onSearch">查询</n-button>
					</n-form-item>
					<n-form-item>
						<n-button type="primary" size="tiny" @click="onDialog()">新增</n-button>
					</n-form-item>
				</n-form>
			</template>
			<template #table="scope">
				<n-data-table
					ref="table"
					size="small"
					virtual-scroll
					:loading="state.loading"
					:max-height="scope.height"
					:columns="columns"
					:data="state.list"
					:row-key="rowKey"
				/>
			</template>
		</table-layout>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, h, ref, Ref } from 'vue';
import { NForm, NFormItem, NInput, NButton, NSwitch, NDataTable, useDialog, useMessage, DialogReactive } from 'naive-ui';
import format from 'date-fns/format';
import { cloneDeep } from 'lodash';
import TableLayout from '@/components/TableLayout.vue';
import { fetch } from '@/plugins/fetch';
import { apiAlias } from '@/config/http';
import RoleRawForm from '@/views/Admin/Permission/components/RoleRawForm.vue';

type DialogAction = 'add' | 'edit';

export default defineComponent({
	components: { NForm, NFormItem, NInput, NButton, TableLayout, NDataTable },
	setup() {
		const dialog = useDialog();
		const message = useMessage();
		const state = reactive({
			search: { name: '' },
			loading: false,
			list: [],
		});
		let dialogIns: DialogReactive;

		// 查询
		const onSearch = () => {
			state.loading = true;
			fetch(apiAlias.SEARCH_ROLE, state.search).then(({ data = [] }) => {
				state.list = data;
			}).finally(() => {
				state.loading = false;
			});
		};

		onSearch();

		// 切换状态
		const onSwitchStatus = (row: RoleRaw) => {
			const { id, status } = row;
			fetch(apiAlias.STATUS_ROLE, { id, status: !status }).then((res) => onSearch());
		};

		const formRef = ref();

		// 确认
		const onPositive = (type: DialogAction = 'add', row: RoleRaw, formRef: Ref) => {
			const url = type === 'add' ? apiAlias.ADD_ROLE : apiAlias.UPDATE_ROLE;
			const msg = type === 'add' ? '新增' : '更新';
			const menu = <Array<number | MenuRaw>>row.menu || [];
			const data = cloneDeep(row);
			if (data?.menu?.length) {
				data.menu = <RoleRaw['menu']> menu.map((item) => {
					if (typeof item === 'number') return { id: item } as MenuRaw;
					if (typeof item === 'object') return item as MenuRaw;
					return 0;
				}).filter(Boolean);
			}
			return formRef.value.validate().then(() => {
				dialogIns.loading = true;
				return fetch(url, data).then((res) => {
					onSearch();
					message.success(`${msg}成功！`);
					return true;
				}).catch(() => {
					message.error(`${msg}失败！`);
					dialogIns.loading = false;
					return false;
				});
			}).catch(() => false);
		};

		// 编辑
		const onDialog = (row: RoleRaw | {} = <RoleRaw>{}, type: DialogAction = 'add') => {
			const title = type === 'add' ? '新增' : '编辑';

			const formValues = <RoleRaw>reactive({
				id: 0,
				name: '',
				status: true,
				description: '',
				createTime: '',
				updateTime: '',
				...row,
			});
			if (formValues?.menu?.length) {
				formValues.menu = formValues.menu.map((item: MenuRaw | number | string) => {
					if (typeof item === 'object') return item?.id || 0;
					return item;
				});
			}
			dialogIns = dialog.create({
				title,
				content: () => h(RoleRawForm, { raw: formValues, parentRaw: state.list, formRef }),
				showIcon: false,
				negativeText: '取消',
				positiveText: '确认',
				onPositiveClick: () => onPositive(type, formValues, formRef),
			});
		};

		const statusRender = (row: RoleRaw) => h(NSwitch, { value: row.status, size: 'small', 'onUpdate:value': () => onSwitchStatus(row) });
		const actionRender = (row: RoleRaw) => h(NButton, { size: 'tiny', type: 'primary', text: true, onClick: () => onDialog(row, 'edit') }, () => '编辑');

		const columns = [
			{ title: '序号', key: 'index', width: 50, render: (row: RoleRaw, index: number) => h(() => index + 1) },
			{ title: '名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
			{ title: '描述', key: 'description', ellipsis: { tooltip: true } },
			{ title: '状态', key: 'status', width: 60, render: statusRender },
			{ title: '创建', key: 'createTime', width: 150, render: (row: RoleRaw, index: number) => h(() => row.createTime && format(new Date(row.createTime), 'yyyy-MM-dd HH:mm')) },
			{ title: '更新', key: 'updateTime', width: 150, render: (row: RoleRaw, index: number) => h(() => row.updateTime && format(new Date(row.updateTime), 'yyyy-MM-dd HH:mm')) },
			{ title: '操作', key: 'id', width: 100, render: actionRender },
		];

		return {
			state,
			columns,
			rowKey: (row: any) => row.id,
			onSearch,
			onDialog,
		};
	},
});
</script>
<style lang="scss" scoped>
	.role {

	}
</style>
