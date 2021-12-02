<!--
 * @Author: daipeng7
 * @Date: 2021-07-07 16:53:51
 * @LastEditTime: 2021-12-02 11:12:15
 * @LastEditors: daipeng7
 * @Description: 登录
-->
<template>
	<main v-if="showLoginForm" class="login">
		<div class="login-form-wrap">
			<n-form ref="formRef" :model="formValues" class="login-form" :show-require-mark="false" :rules="rules" size="small" label-placement="left" label-width="70px" @keyup.enter.stop="onLogin">
				<h5 class="login-title">登录</h5>
				<n-form-item path="account" label="账号">
					<n-input v-model:value="formValues.account" placeholder="请输入账号" @keydown.enter.prevent>
						<template #prefix><i class="ift-account" /></template>
					</n-input>
				</n-form-item>
				<n-form-item path="password" label="密码">
					<n-input v-model:value="formValues.password" type="password" show-password-toggle placeholder="请输入密码" @keydown.enter.prevent>
						<template #prefix><i class="ift-password" /></template>
					</n-input>
				</n-form-item>
				<n-form-item path="captchaValue" label="验证码">
					<div class="captcha-wrap">
						<n-input v-model:value="formValues.captchaValue" class="captcha-input" placeholder="验证码" @keydown.enter.prevent />
						<img class="captcha-img" :src="captchaImg" alt="" @click="onCaptcha">
					</div>
				</n-form-item>
				<n-space justify="center">
					<n-button type="primary" :loading="logging" size="small" @click="onLogin">
						{{ logging ? '登录中...' : '登录' }}
					</n-button>
					<n-button size="small" @click="onLogon">
						注册
					</n-button>
				</n-space>
			</n-form>
		</div>
	</main>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { NForm, NFormItem, NInput, NButton, FormItemRule, FormValidationError, NSpace } from 'naive-ui';
import { useStore } from '@/store';
import { fetch } from '@/plugins/fetch';
import { LoginStatus } from '@/store/type';

export default defineComponent({
	name: 'Login',
	components: {
		NForm, NFormItem, NInput, NButton, NSpace,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const formValues = reactive({
			account: '',
			password: '',
			captchaId: '',
			captchaValue: '',
		});
		const state = reactive({
			logging: false,
		});
		const formRef = ref();
		const captchaImg = ref('');
		const showLoginForm = computed(() => {
			const { Logined, Validating } = LoginStatus;
			return ![Logined, Validating].includes(store.state.app.loginStatus);
		});

		// 校验账号
		const onValidateAccount = (rule: FormItemRule, value: any) => {
			if ([undefined, null, ''].includes(value)) return new Error('请输入账号');
			if (!/\w{4,10}/.test(value)) return new Error('4-10个字母或数字组成');
			return true;
		};
		// 校验密码
		const onValidatePwd = (rule: FormItemRule, value: any) => {
			if ([undefined, null, ''].includes(value)) return new Error('请输入密码');
			if (!/\w{6,10}/.test(value)) return new Error('6-18个字母或数字组成');
			return true;
		};

		const rules = {
			account: [{ required: true, validator: onValidateAccount, trigger: ['blur'] }],
			password: [{ required: true, validator: onValidatePwd, trigger: ['blur'] }],
			captchaValue: [{ required: true, message: '请输入验证码', trigger: ['blur'] }],
		};

		// 获取验证码
		const onCaptcha = () => {
			fetch('captcha', { width: 500, height: 200 }).then(({ data }) => {
				const { id, base64 } = data;
				formValues.captchaId = id;
				captchaImg.value = base64;
			});
		};

		// onCaptcha();

		// 登录
		const onLogin = () => {
			formRef.value.validate((errors: FormValidationError[]) => {
				if (!errors) {
					state.logging = true;
					store.dispatch('app/login', formValues).then((res) => {

					}).catch(onCaptcha).finally(() => {
						state.logging = false;
					});
				}
			});
		};

		// 注册
		const onLogon = () => {
			router.push({ name: 'register' });
		};

		return {
			showLoginForm,
			formValues,
			captchaImg,
			formRef,
			rules,
			...toRefs(state),
			onValidateAccount,
			onValidatePwd,
			onLogin,
			onLogon,
			onCaptcha,
		};
	},
	renderTracked(args) {
		console.log('renderTracked = ', args);
	},
	renderTriggered(args) {
		console.log('renderTriggered = ', args);
	},
});
</script>
<style lang="scss" scoped>
$loginFormPading: 20px 20px 20px 10px;
.login{
	@include flex(row, center, center);
	min-height: 400px;
	height: 100%;
	.login-form-wrap{
		padding: 10px;
		border-radius: 10px;
		background-color: color(light);
		.login-form{
			padding: $loginFormPading;
			background: color(white);
			border-radius: 10px;
			.login-title{
				text-align: center;
				padding: 10px 0 20px 10px;
			}
			.form-buttons{
				text-align: center;
				padding: 20px 0 0 10px;
			}
			.captcha-wrap{
				@include flex(row, space-between, center);
				.captcha-input{
					width: 100px;
					margin-right: 10px;
				}
				.captcha-img{
					width: 80px;
					cursor: pointer;
				}
			}
		}
	}
}
</style>
