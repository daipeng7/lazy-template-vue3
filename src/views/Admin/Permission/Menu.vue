<!--
 * @Author: daipeng7
 * @Date: 2021-08-09 19:14:31
 * @LastEditTime: 2021-08-26 11:42:06
 * @LastEditors: daipeng7
 * @Description: 菜单权限
-->
<template>
	<div class="menu">
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
import MenuRawForm from '@/views/Admin/Permission/components/MenuRawForm.vue';
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
			fetch(apiAlias.SEARCH_MENU, state.search).then(({ data = [] }) => {
				state.list = <never[]>utils.tool.parseTree<MenuRaw>(data, (raw) => ({ ...raw, label: raw?.meta?.title, value: raw.id }));
			}).finally(() => {
				state.loading = false;
			});
		};

		onSearch();

		// 切换隐藏/缓存
		const onSwitchStatus = (row: MenuRaw, key: string) => {
			const { id, hidden, keepAlive } = row;
			if (key === 'hidden') {
				fetch(apiAlias.HIDDEN_MENU, { id, hidden: !hidden }).then((res) => onSearch());
			} else if (key === 'keepAlive') {
				fetch(apiAlias.KEEPALIVE_MENU, { id, keepAlive: !keepAlive }).then((res) => onSearch());
			}
		};

		const formRef = ref();

		// 确认
		const onPositive = (type: DialogAction = 'add', row: MenuRaw, formRef: Ref) => {
			const url = type === 'add' ? apiAlias.ADD_MENU : apiAlias.UPDATE_MENU;
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
		const onDialog = (row: MenuRaw | {} = <MenuRaw>{}, type: DialogAction = 'add') => {
			const title = type === 'add' ? '新增' : '编辑';
			const formValues = reactive({
				id: 0,
				parentId: 0,
				name: '',
				path: '',
				component: '',
				redirect: '',
				sort: 0,
				hidden: false,
				keepAlive: true,
				meta: { title: '', icon: '' },
				...row });
			dialogIns = dialog.create({
				title,
				content: () => h(MenuRawForm, { raw: formValues, parentRaw: state.list, formRef }),
				showIcon: false,
				negativeText: '取消',
				positiveText: '确认',
				onPositiveClick: () => onPositive(type, formValues, formRef),
			});
		};

		const hiddenRender = (row: MenuRaw) => h(NSwitch, { value: row.hidden, size: 'small', 'onUpdate:value': () => onSwitchStatus(row, 'hidden') });
		const keepAliveRender = (row: MenuRaw) => h(NSwitch, { value: row.keepAlive, size: 'small', 'onUpdate:value': () => onSwitchStatus(row, 'keepAlive') });
		const actionRender = (row: MenuRaw) => h(NButton, { size: 'tiny', type: 'primary', text: true, onClick: () => onDialog(row, 'edit') }, () => '编辑');
		const columns = [
			{ title: '名称', key: 'name', width: 200, ellipsis: { tooltip: true } },
			{ title: '别名', key: 'meta.title', width: 200, ellipsis: { tooltip: true }, render: (row: MenuRaw) => row.meta.title },
			{ title: '路由', key: 'path', ellipsis: { tooltip: true } },
			{ title: '重定向', key: 'redirect', width: 130, ellipsis: { tooltip: true } },
			{ title: '排序', key: 'sort', width: 80, ellipsis: { tooltip: true } },
			{ title: '隐藏', key: 'hidden', width: 60, render: hiddenRender },
			{ title: '缓存', key: 'keepAlive', width: 60, render: keepAliveRender },
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
	.menu {
		height: 100%;
	}
</style>
