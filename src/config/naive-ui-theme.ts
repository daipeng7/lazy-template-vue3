/*
 * @Author: daipeng7
 * @Date: 2021-08-18 10:01:33
 * @LastEditTime: 2021-08-25 17:26:54
 * @LastEditors: daipeng7
 * @Description: naive ui 主题配置
 */
import { GlobalThemeOverrides } from 'naive-ui';

const theme: GlobalThemeOverrides = {
	Menu: {
		colorInverted: '#545c64',
		itemTextColor: '#FFFFFF',
		itemTextColorHover: '#7FE7C4FF',
		itemTextColorActive: '#63E2B7FF',
		itemTextColorChildActive: '#63E2B7FF',
		itemIconColor: 'rgba(255, 255, 255, 0.9)',
		itemIconColorHover: '#7FE7C4FF',
		itemIconColorActive: '#63E2B7FF',
		itemIconColorChildActive: '#63E2B7FF',
	},
	Button: {
		heightTiny: '24px',
	},
	DataTable: {
		thPaddingSmall: '6px',
		tdPaddingSmall: '6px',
	},
	Form: {
		blankHeightSmall: '24px',
	},
	Input: {
		heightSmall: '24px',
	},
	Dialog: {
		contentMargin: '16px 0',
	},
};

export default theme;
