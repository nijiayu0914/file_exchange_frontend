const CracoAntDesignPlugin = require('craco-antd');
const path = require('path');
const pathResolve = pathUrl => path.join(__dirname, pathUrl);

module.exports = {
    babel: {
        plugins: [
        ]
    },
    webpack: {
        alias: {
            '@@': pathResolve('.'),
            '@': pathResolve('src'),
            '@config': pathResolve('src/config'),
            '@pages': pathResolve('src/pages'),
            '@store': pathResolve('src/store'),
            '@components': pathResolve('src/components')
        },
    },
    devServer: {
        hot: true,
        compress: true,
        proxy: {
            '/api': {
                target: 'http://0.0.0.0:8080',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        https: false
    },
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    '@body-background': '#F3F4F7',
                    '@component-background': '#fff',
                    '@primary-color': '#85a5ff', // 全局主色
                    '@link-color': '#85a5ff', // 链接色
                    '@success-color': '#52c41a', // 成功色
                    '@warning-color': '#faad14', // 警告色
                    '@error-color': '#f5222d', // 错误色
                    '@font-size-base': '14px', // 主字号
                    '@heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
                    '@text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
                    '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
                    '@disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
                    '@border-radius-base': '2px', // 组件/浮层圆角
                    '@border-color-base': 'rgba(0, 0, 0, 0.25)', // 边框色
                    '@box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)', // 浮层阴影
                    '@level1': "#e6f7ff",
                    '@level2': "#bae7ff",
                    '@level3': "#91d5ff",
                    '@level4': "#69c0ff",
                    '@level5': "#40a9ff",
                    '@level6': "#1890ff",
                    '@level7': "#096dd9",
                    '@level8': "#0050b3",
                    '@level9': "#003a8c",
                    '@level10': "#002766",
                    '@basic-white': "#FFFFFF"
                },
            },
        }
    ]
};
