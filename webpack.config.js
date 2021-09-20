const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
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
            static: {
                directory: path.join(__dirname, 'dist')
            },
            hot: true
        },
        optimization: {
            minimize: isProductionBuild,
            minimizer: [
                `...`,
                new CssMinimizerPlugin(),
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
            clean: true,
            crossOriginLoading: 'anonymous',
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'index.html'),
                title: 'React Minesweeper',
                meta: {
                    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
                }
            }),
            new SubresourceIntegrityPlugin(),
            !isProductionBuild && new webpack.HotModuleReplacementPlugin(),
        ].filter(Boolean),
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        }
    };
};
