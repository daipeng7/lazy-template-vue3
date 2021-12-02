<!--
 * @Author: daipeng7
 * @Date: 2021-08-24 17:02:44
 * @LastEditTime: 2021-08-26 14:24:33
 * @LastEditors: daipeng7
 * @Description: 菜单编辑form
-->
<template>
	<n-form ref="formRef2" class="menu-raw-form" :model="formValue" :rules="rules" label-width="70px" label-placement="left" size="small">
		<n-form-item label="父级" path="parentId">
			<n-cascader
				v-model:value="formValue.parentId"
				size="small"
				placeholder="请选择父菜单"
				expand-trigger="hover"
				:options="cascaderOptions"
				:cascade="false"
			/>
		</n-form-item>
		<n-form-item label="名称" path="name">
			<n-input v-model:value="formValue.name" clearable placeholder="请输入名称" />
		</n-form-item>
		<n-form-item label="别名" path="meta.title">
			<n-input v-model:value="formValue.meta.title" clearable placeholder="请输入菜单别名" />
		</n-form-item>
		<n-form-item label="图标" path="meta.icon">
			<n-input v-model:value="formValue.meta.icon" clearable placeholder="请输入菜单图标" />
		</n-form-item>
		<n-form-item label="地址" path="path">
			<n-input v-model:value="formValue.path" clearable placeholder="请输入路由地址" />
		</n-form-item>
		<n-form-item label="组件" path="component">
			<n-input v-model:value="formValue.component" clearable placeholder="请输入组件路径" />
		</n-form-item>
		<n-form-item label="重定向" path="redirect">
			<n-input v-model:value="formValue.redirect" clearable placeholder="请输入路由重定向" />
		</n-form-item>
		<n-form-item label="序号" path="sort">
			<n-input-number v-model:value="formValue.sort" :min="0" />
		</n-form-item>
		<n-form-item label="隐藏" path="hidden">
			<n-switch v-model:value="formValue.hidden" />
		</n-form-item>
		<n-form-item label="缓存" path="keepAlive">
			<n-switch v-model:value="formValue.keepAlive" />
		</n-form-item>
	</n-form>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { NForm, NFormItem, NInput, NInputNumber, NSwitch, NCascader } from 'naive-ui';

export default defineComponent({
	name: 'MenuRawForm',
	components: { NForm, NFormItem, NInput, NInputNumber, NSwitch, NCascader },
	props: {
		parentRaw: { type: Array, default: () => ([]) },
		raw: { type: Object, default: () => ({}) },
		formRef: { type: Object, default: ref() },
	},
	setup(props) {
		const formValue = reactive(<MenuRaw>props.raw);
		const formRef2 = ref(props.formRef);
		const cascaderOptions = computed(() => [{ label: '无', value: 0, id: 0, parentId: 0 }, ...props.parentRaw]);
		const rules = {
			parentId: [{ required: true, type: 'number', message: '请选择父级菜单', trigger: ['change'] }],
			name: [{ required: true, message: '请输入菜单名称', trigger: ['blur'] }],
			path: [{ required: true, message: '请输入路由地址', trigger: ['blur'] }],
			component: [{ required: true, message: '请输入组件路径', trigger: ['blur'] }],
			'meta.title': [{ required: true, message: '请输入菜单别名', trigger: ['blur'] }],
			'meta.icon': [{ required: true, message: '请输入菜单图标', trigger: ['blur'] }],
		};
		return {
			formValue,
			rules,
			formRef2,
			cascaderOptions,
		};
	},
});
</script>
<style lang="scss" scoped>

</style>
