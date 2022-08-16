const path = require('path');

const createBuildConfig = (buildType) => ({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, `dist/lib/${buildType}`),
    filename: 'gbif-react-components.js',
    library: {
      name: buildType === 'var' ? 'gbifReactComponents' : undefined,
      type: buildType,
    },
  },
  devtool: 'source-map',
  externals: {
    react: {
      var: 'React',
      module: 'React',
    },
    'react-dom': {
      var: 'ReactDOM',
      module: 'ReactDOM',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'transform-react-remove-prop-types',
              '@babel/plugin-transform-runtime',
            ],
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@emotion/babel-preset-css-prop',
            ],
          },
        },
      },
    ],
  },
  experiments: {
    outputModule: buildType === 'module',
  },
});

module.exports = ['var'].map((buildType) => createBuildConfig(buildType));
