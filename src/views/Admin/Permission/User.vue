<!--
 * @Author: daipeng7
 * @Date: 2021-08-17 09:58:37
 * @LastEditTime: 2021-09-03 14:14:16
 * @LastEditors: daipeng7
 * @Description: 用户管理
-->
<template>
	<div class="user">
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
import TableLayout from '@/components/TableLayout.vue';
import { fetch } from '@/plugins/fetch';
import { apiAlias } from '@/config/http';
import UserRawForm from '@/views/Admin/Permission/components/UserRawForm.vue';
import utils from '@/utils';

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
			fetch(apiAlias.SEARCH_USER, state.search).then(({ data = [] }) => {
				state.list = data;
			}).finally(() => {
				state.loading = false;
			});
		};

		onSearch();

		// 切换状态
		const onSwitchStatus = (row: UserRaw) => {
			const { id, status } = row;
			fetch(apiAlias.STATUS_USER, { id, status: !status }).then((res) => onSearch());
		};

		const formRef = ref();

		// 确认
		const onPositive = (type: DialogAction = 'add', row: UserRaw, formRef: Ref) => {
			const url = type === 'add' ? apiAlias.ADD_USER : apiAlias.UPDATE_USER;
			const msg = type === 'add' ? '新增' : '更新';
			return formRef.value.validate().then(() => {
				dialogIns.loading = true;
				return fetch(url, row).then((res) => {
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
		const onDialog = (row: UserRaw | {} = <UserRaw>{}, type: DialogAction = 'add') => {
			const title = type === 'add' ? '新增' : '编辑';

			const formValues = <UserRaw>reactive({
				id: 0,
				roleId: 0,
				uuid: '',
				name: '',
				account: '',
				nickname: '',
				password: '',
				gender: 1,
				avatar: '',
				phone: '',
				status: true,
				description: '',
				...row,
			});
			dialogIns = dialog.create({
				title,
				content: () => h(UserRawForm, { raw: formValues, parentRaw: state.list, formRef }),
				showIcon: false,
				negativeText: '取消',
				positiveText: '确认',
				onPositiveClick: () => onPositive(type, formValues, formRef),
			});
		};

		const statusRender = (row: UserRaw) => h(NSwitch, { value: row.status, size: 'small', 'onUpdate:value': () => onSwitchStatus(row) });
		const actionRender = (row: UserRaw) => h(NButton, { size: 'tiny', type: 'primary', text: true, onClick: () => onDialog(row, 'edit') }, () => '编辑');

		const columns = [
			{ title: '序号', key: 'index', width: 50, render: (row: UserRaw, index: number) => h(() => index + 1) },
			{ title: '姓名', key: 'name', width: 150, ellipsis: { tooltip: true } },
			{ title: '账号', key: 'account', width: 150, ellipsis: { tooltip: true } },
			{ title: '昵称', key: 'nickname', width: 150, ellipsis: { tooltip: true } },
			{ title: '性别', key: 'gender', width: 60, render: (row: UserRaw, index: number) => h(() => utils.tool.genderFormat(row.gender)) },
			{ title: '状态', key: 'status', width: 60, render: statusRender },
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
	.user{

	}
</style>
