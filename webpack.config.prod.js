const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  devServer: {
    contentBase: './dist'
  },
  module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.ts$/,
          enforce: 'pre',
          use: [
            {
              loader: 'tslint-loader',
              options: {
                emitErrors: false
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
};
