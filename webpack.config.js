const path = require('path');

module.exports = {
    entry: './src/IK.ts',

    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'IK-browser.js',
        path: path.resolve(__dirname, 'build'),
        library: 'IK',
        libraryTarget: 'window'
    },
};