const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
    const isProductionBuild = argv && argv.mode === 'production';

    return {
        entry: './src/index.ts',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader'
                },
                {
                    test: /\.jsx?/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        isProductionBuild ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !isProductionBuild
                            }
                        }
                    ]
                }
            ]
        },
        devtool: isProductionBuild ? false : 'inline-source-map',
        devServer: {
            contentBase: './dist',
            hot: true
        },
        optimization: {
            minimize: isProductionBuild,
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true
                }),
                new OptimizeCSSAssetsPlugin({})
            ],
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'all',
                        test: path.resolve(__dirname, 'node_modules'),
                        name: 'vendor',
                        enforce: true
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
                module: 'main.js'
            }),
            new SriPlugin({
                hashFuncNames: ['sha256', 'sha384'],
                enabled: isProductionBuild,
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            !isProductionBuild && new webpack.HotModuleReplacementPlugin(),
        ].filter(Boolean),
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        }
    };
};
