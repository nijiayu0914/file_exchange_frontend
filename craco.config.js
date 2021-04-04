const CracoAntDesignPlugin = require('craco-antd');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
        plugins: [
            new BundleAnalyzerPlugin(
                {
                    analyzerMode: 'disabled',
                    generateStatsFile: true,
                    statsOptions: { source: false }
                }
            ),
            process.env.NODE_ENV === "production" ?
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true,
                    },
                },
                sourceMap: false,
                parallel: true,
            }) : () => {},
            // 打压缩包
            new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                threshold: 1024,
                minRatio: 1
            })
        ],
        configure: (webpackConfig, {
            env, paths
        }) => {
            webpackConfig.context = path.resolve('./src')
            webpackConfig.entry = {"main": "./index.tsx"}
            webpackConfig.optimization.splitChunks = {
                minChunks: 1,
                maxAsyncRequests: 6,
                maxInitialRequests: 6,
                automaticNameDelimiter: '~',
                cacheGroups: {
                    basic: {
                        test: /(react|react-dom|react-dom-router|babel-polyfill|mobx)/,
                        chunks: 'all',
                        priority: 100,
                    },
                    antd: {
                        test: /[\\/]antd[\\/]/,
                        chunks: 'all',
                        priority: 90
                    },
                    oss: {
                        test: /[\\/]ali-oss[\\/]/,
                        chunks: 'all',
                        priority: 80
                    },
                    commons: {
                        chunks: 'all',
                        priority: 70,
                        reuseExistingChunk: true,

                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        name: 'vendor',
                        priority: 10,
                        enforce: true,
                        reuseExistingChunk: true,
                    }
                }
            }
            return webpackConfig
        }
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
