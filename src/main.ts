import { createApp } from 'vue';
import { NMessageProvider } from 'naive-ui';
import { installComponent } from '@/components';
import { installDirective } from '@/directives';
import { installPlugin } from '@/plugins';
import { installRouter } from '@/router';
import { installStore } from '@/store';

import '@/style/index.scss';

const app = createApp({
	components: { NMessageProvider },
	template: '<n-message-provider><router-view></router-view></n-message-provider>',
});

/** ******** 应用初始化 ********* */
installDirective(app);
installPlugin(app);
installComponent(app);
installRouter(app);
installStore(app);

/** ******** 挂载应用 ********* */
app.mount('#app');
