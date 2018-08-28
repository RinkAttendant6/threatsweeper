const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const webpack = require('webpack');

module.exports = (env, argv) => ({
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: argv.mode !== 'production'
                        }
                    }
                ]
            }
        ]
    },
    devtool: argv && argv.mode === 'production' ? false : 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    optimization: {
        minimize: argv.mode === 'production',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: path.resolve(__dirname, 'node_modules'),
                    name: 'vendor',
                    enforce: true,
                }
            }
        }
    },
    output: {
        crossOriginLoading: 'anonymous',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            title: 'React Minesweeper',
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer',
            module: 'index.js'
        }),
        new SriPlugin({
            hashFuncNames: ['sha256', 'sha384'],
            enabled: argv.mode === 'production',
        }),
        argv.mode !== 'production' && new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean)
});
