<!--
 * @Author: daipeng7
 * @Date: 2021-08-24 17:02:44
 * @LastEditTime: 2021-09-03 14:33:15
 * @LastEditors: daipeng7
 * @Description: 用户编辑form
-->
<template>
	<n-form ref="formRef2" class="user-raw-form" :model="formValue" :rules="rules" label-width="70px" label-placement="left" size="small">
		<n-form-item label="角色" path="roleId">
			<n-select v-model:value="formValue.roleId" :options="roleOptions" clearable placeholder="请输选择角色" />
		</n-form-item>
		<n-form-item label="姓名" path="name">
			<n-input v-model:value="formValue.name" clearable placeholder="请输入用户姓名" />
		</n-form-item>
		<n-form-item label="账号" path="account">
			<n-input v-model:value="formValue.account" clearable placeholder="请输入用户账号" />
		</n-form-item>
		<n-form-item label="密码" path="password">
			<n-input v-model:value="formValue.password" clearable placeholder="请输入用户密码" />
		</n-form-item>
		<n-form-item label="昵称" path="nickname">
			<n-input v-model:value="formValue.nickname" clearable placeholder="请输入用户昵称" />
		</n-form-item>
		<n-form-item label="性别" path="gender">
			<n-radio-group v-model:value="formValue.gender" name="gender">
				<n-space>
					<n-radio :value="1">男</n-radio>
					<n-radio :value="2">女</n-radio>
				</n-space>
			</n-radio-group>
		</n-form-item>
		<n-form-item label="状态" path="status">
			<n-switch v-model:value="formValue.status" />
		</n-form-item>
		<n-form-item label="描述" path="description">
			<n-input v-model:value="formValue.description" type="textarea" clearable placeholder="请输入用户描述" />
		</n-form-item>
	</n-form>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watchEffect } from 'vue';
import { NForm, NFormItem, NInput, NSwitch, NRadioGroup, NRadio, NSpace, NSelect, FormItemRule, SelectOption } from 'naive-ui';
import { fetch } from '@/plugins/fetch';
import { apiAlias } from '@/config/http';
import tool from '@/utils/tool';

export default defineComponent({
	name: 'RoleRawForm',
	components: { NForm, NFormItem, NInput, NSwitch, NRadioGroup, NRadio, NSpace, NSelect },
	props: {
		parentRaw: { type: Array, default: () => ([]) },
		raw: { type: Object, default: () => ({}) },
		formRef: { type: Object, default: ref() },
	},
	setup(props) {
		const formValue = reactive(props.raw);
		const formRef2 = ref(props.formRef);
		const roleOptions: SelectOption[] = reactive([]);
		const rules = {
			roleId: [{ required: true, type: 'number', message: '请输选择角色', trigger: ['blur'] }],
			name: [{ required: true, message: '请输入用户名称', trigger: ['blur'] }],
			account: [{ required: true, message: '请输入用户账号', trigger: ['blur'] }],
			password: [{ required: true, message: '请输入用户密码', trigger: ['blur'] }],
			nickname: [{ required: true, message: '请输入用户昵称', trigger: ['blur'] }],
		};

		fetch(apiAlias.SEARCH_ROLE).then(({ data = [] }) => {
			if (Array.isArray(data)) roleOptions.push(...<SelectOption[]>data.map((role: RoleRaw) => ({ label: role.name, value: role.id })));
		});

		return {
			formValue,
			rules,
			formRef2,
			roleOptions,
		};
	},
});
</script>
<style lang="scss">
.user-raw-form{
	.n-form-item-blank{
		width: 320px;
		.n-base-selection-tag-wrapper .n-tag{
			height: 22px;
		}
	}
}
</style>
