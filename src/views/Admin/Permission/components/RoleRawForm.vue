<!--
 * @Author: daipeng7
 * @Date: 2021-08-24 17:02:44
 * @LastEditTime: 2021-09-02 11:55:09
 * @LastEditors: daipeng7
 * @Description: 角色编辑form
-->
<template>
	<n-form ref="formRef2" class="role-raw-form" :model="formValue" :rules="rules" label-width="70px" label-placement="left" size="small">
		<n-form-item label="名称" path="name">
			<n-input v-model:value="formValue.name" clearable placeholder="请输入角色名称" />
		</n-form-item>
		<n-form-item label="描述" path="description">
			<n-input v-model:value="formValue.description" type="textarea" clearable placeholder="请输入角色描述" />
		</n-form-item>
		<n-form-item label="状态" path="status">
			<n-switch v-model:value="formValue.status" />
		</n-form-item>
		<n-form-item label="菜单" path="menu">
			<n-cascader
				v-model:value="formValue.menu"
				style="max-width:100%"
				size="small"
				placeholder="请选择菜单"
				expand-trigger="hover"
				multiple
				clearable
				:show-path="false"
				:leaf-only="false"
				:options="cascaderOptions"
				:cascade="true"
				max-tag-count="responsive"
			/>
		</n-form-item>
	</n-form>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { NForm, NFormItem, NInput, NSwitch, NCascader, FormItemRule } from 'naive-ui';
import { fetch } from '@/plugins/fetch';
import { apiAlias } from '@/config/http';
import tool from '@/utils/tool';

export default defineComponent({
	name: 'RoleRawForm',
	components: { NForm, NFormItem, NInput, NSwitch, NCascader },
	props: {
		parentRaw: { type: Array, default: () => ([]) },
		raw: { type: Object, default: () => ({}) },
		formRef: { type: Object, default: ref() },
	},
	setup(props) {
		const formValue = reactive(props.raw);
		const formRef2 = ref(props.formRef);
		const cascaderOptions = reactive([]);
		// 校验菜单选择
		const onValidateMenu = (rule: FormItemRule, value: number[] = []) => {
			if (!value.length) return new Error('请选择菜单');
			return true;
		};
		const rules = {
			name: [{ required: true, message: '请输入角色名称', trigger: ['blur'] }],
			menu: [{ required: true, message: '请选择菜单', validator: onValidateMenu, trigger: ['blur'] }],
		};

		fetch(apiAlias.SEARCH_MENU).then(({ data = [] }) => {
			const list = <never[]>tool.parseTree<MenuRaw>(data, (raw) => ({ ...raw, label: raw?.meta?.title, value: raw.id }));
			cascaderOptions.push(...list);
		});

		if (formValue.id) {
			fetch(apiAlias.SEARCH_MENU, { roleId: formValue.id }).then(({ data = [] }) => {
				formValue.menu = data.map((item: MenuRaw) => item.id);
			});
		}

		return {
			formValue,
			rules,
			formRef2,
			cascaderOptions,
		};
	},
});
</script>
<style lang="scss">
.role-raw-form{
	.n-form-item-blank{
		width: 320px;
		.n-base-selection-tag-wrapper .n-tag{
			height: 22px;
		}
	}
}
</style>
