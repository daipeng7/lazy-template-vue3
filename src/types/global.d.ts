/*
 * @Author: daipeng7
 * @Date: 2021-08-24 17:27:28
 * @LastEditTime: 2021-09-03 14:14:03
 * @LastEditors: daipeng7
 * @Description:
 */
declare interface Window {
	$message: import('naive-ui/lib/message/src/MessageProvider').MessageApiInjection
}

type MenuRaw = {
	id: number
	parentId: number | 0
	name: string
	path: string
	component: string
	redirect: string
	sort: number
	hidden: boolean
	keepAlive: boolean
	meta: {
		title: string
		icon: string
	},
	children?: MenuRaw[]
}

type RoleRaw = {
	id: number
	name: string
	status: boolean
	description: string
	menu?: MenuRaw[] | Array<never|number|string>
	createTime?: string | number | Date
	updateTime?: string | number | Date
}

type UserRaw = {
	id: number
	roleId: number
	uuid: string
	name: string
	account: string
	nickname: string
	password: string
	gender: number
	avatar: string
	phone: string
	status: boolean
	description: string
	createTime?: string | number | Date
	updateTime?: string | number | Date
}
