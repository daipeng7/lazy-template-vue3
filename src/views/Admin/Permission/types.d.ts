declare module '*.vue' {
	type MenuRaw = {
		id: number,
		name: string,
		path: string,
		redirect: string,
		hidden: boolean,
		keepAlive: boolean,
		meta: {
			title: string,
			icon: string
		},
		children: MenuRaw[]
	}
}
