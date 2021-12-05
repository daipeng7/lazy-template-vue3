import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// import styleImport from 'vite-plugin-style-import';
import rollupPluginIconfont from '@daipeng7/rollup-plugin-iconfont';

const resolve = (...list: string[]) => path.resolve(__dirname, ...list);
const includesStyleReg = new RegExp(`^${resolve('src')}`);
const includesStylePaths = (filename) => includesStyleReg.test(filename);
const additionalData = (source, filename) => {
    if (includesStylePaths(filename)) return `@import "@/style/core/_index.scss"; \n ${source}`;
    return source;
};

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 8900,
        open: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8089',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData,
            },
            sass: {
                additionalData,
            },
        },
    },
    plugins: [
        rollupPluginIconfont({
            svgs: resolve('src/assets/svgs/*.svg'),
            fontsOutput: resolve('src/style/iconfont/fonts'),
            cssOutput: resolve('src/style/iconfont/index.css'),
            fontName: 'custom-iconfont',
            jsOutput: false,
            htmlOutput: false,
            template: 'scss',
            cssFontPath: '@/style/iconfont/fonts',
            cssPrefix: 'ift',
        }),
        vue(),
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
            '@': resolve('./src'),
        },
    },
});
