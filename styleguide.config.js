const path = require("path");
const camelCase = require('lodash/camelCase');
const upperFirst = require('lodash/upperFirst');
const { styles, theme } = require('./styleguide.styles');

module.exports = {
  title: "Blackbox React Components Library",
  serverPort: 6060,
  styles,
  theme,
  getComponentPathLine: (componentPath) => {
    const dirname = path.dirname(componentPath, '.js');
    const name = dirname.split('/').slice(-1)[0];
    const componentName = upperFirst(camelCase(name));

    return 'import ' + componentName + ' from \'blackbox-react/' + name + '\''
  },
  sections: [
    {
      name: '',
      content: 'src/components/readme.md'
    },
    {
      name: 'Components',
      components: () => ([
        path.resolve(__dirname, 'src/components/accordion', 'index.js'),
        path.resolve(__dirname, 'src/components/button', 'index.js'),
        path.resolve(__dirname, 'src/components/button-group', 'index.js'),
        path.resolve(__dirname, 'src/components/button-share', 'index.js'),
        path.resolve(__dirname, 'src/components/carousel', 'index.js'),
        path.resolve(__dirname, 'src/components/flippy', 'index.js'),
        path.resolve(__dirname, 'src/components/heading', 'index.js'),
        path.resolve(__dirname, 'src/components/icon', 'index.js'),
        path.resolve(__dirname, 'src/components/image', 'index.js'),
        path.resolve(__dirname, 'src/components/lazy-image', 'index.js'),
        path.resolve(__dirname, 'src/components/loading', 'index.js'),
        path.resolve(__dirname, 'src/components/meta', 'index.js'),
        path.resolve(__dirname, 'src/components/modal', 'index.js'),
        path.resolve(__dirname, 'src/components/number-to-words', 'index.js'),
        path.resolve(__dirname, 'src/components/progress-bar', 'index.js'),
        path.resolve(__dirname, 'src/components/rich-text', 'index.js'),
        path.resolve(__dirname, 'src/components/ticker', 'index.js'),
        path.resolve(__dirname, 'src/components/tooltip', 'index.js')
      ])
    },
    {
      name: 'Forms',
      components: () => ([
        path.resolve(__dirname, 'src/components/filter', 'index.js'),
        path.resolve(__dirname, 'src/components/form', 'index.js'),
        path.resolve(__dirname, 'src/components/input-field', 'index.js'),
        path.resolve(__dirname, 'src/components/input-select', 'index.js'),
        path.resolve(__dirname, 'src/components/input-date', 'index.js'),
        path.resolve(__dirname, 'src/components/input-search', 'index.js'),
        path.resolve(__dirname, 'src/components/input-search-result', 'index.js'),
        path.resolve(__dirname, 'src/components/input-file', 'index.js'),
        path.resolve(__dirname, 'src/components/input-validations', 'index.js'),
        path.resolve(__dirname, 'src/components/label', 'index.js'),
        path.resolve(__dirname, 'src/components/search-form', 'index.js')
      ])
    },
    {
      name: 'Layout',
      components: () => ([
        path.resolve(__dirname, 'src/components/container', 'index.js'),
        path.resolve(__dirname, 'src/components/grid', 'index.js'),
        path.resolve(__dirname, 'src/components/grid-column', 'index.js'),
        path.resolve(__dirname, 'src/components/section', 'index.js')
      ])
    },
    {
      name: 'Pages',
      components: () => ([
        path.resolve(__dirname, 'src/components/pagination', 'index.js'),
        path.resolve(__dirname, 'src/components/leaderboard', 'index.js'),
        path.resolve(__dirname, 'src/components/leaderboard-item', 'index.js'),
        path.resolve(__dirname, 'src/components/metric', 'index.js'),
        path.resolve(__dirname, 'src/components/metric-group', 'index.js'),
        path.resolve(__dirname, 'src/components/search-results', 'index.js'),
        path.resolve(__dirname, 'src/components/search-result', 'index.js')
      ])
    },
    {
      name: 'Scripts',
      components: () => ([
        path.resolve(__dirname, 'src/components/typekit', 'index.js')
      ])
    },
    {
      name: 'Theming',
      components: () => ([
        path.resolve(__dirname, 'src/components/traits-provider', 'index.js')
      ])
    },
    {
      name: 'Higher Order Components',
      sections: [
        {
          name: 'withForm',
          content: 'src/components/with-form/Readme.md'
        },
        {
          name: 'withToggle',
          content: 'src/components/with-toggle/Readme.md'
        }
      ]
    }
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    }
  },
  styleguideDir: "dist-docs",
  moduleAliases: {
    "blackbox-react": path.resolve(__dirname, "src")
  }
};