# xbundle
从此告别webpack复杂的配置，一键打包。

> 这个项目是在webpack上做的一层封装，所以你既可以享受webpack带来的便捷，又不需要处理webpack复杂的配置。

[English Document](README_EN.md)

## 安装

```bash
npm i xbundle -D
```

xbundle可以全局安装，但是不推荐.

## 使用方法

安装xbundle之后，在package.json的scripts中添加打包脚本。

```json
{
  "scripts": {
    "build": "xbundle -e src"
  }
}
```

**完全零配置，完全自动化**

你可以放心的在项目中使用react，es6, less, polyfill等，xbundle全部帮你集成了。

## 命令行

以下是你使用 `xbundle --help` 打印的使用信息.

```bash
  Usage: xbundle [options]

  Options:

    -V, --version                    output the version number
    --root [root]                    root context relative to process.cwd()
    --ay, --analyze                  Visualize size of webpack output files with an interactive zoomable treemap.
    --mv, --modifyVars [modifyVars]  Enables run-time modification of Less variables.
    --bp, --babelPolyfill            Use babel-polyfill to polyfill your code.
    --pfx, --prefix [prefix]         Add prefix to output filename. (default: )
    -c, --xConfig [xConfig]          config file of xbundle
    -e, --entry [entry]              The entry of xbundle (default: ./src/index.js)
    -p, --path [path]                The output path of xbundle (default: ./dist)
    -j, --jsx                        Entry extension is .jsx
    -m, --mode [mode]                production or development. (default: production)
    -a, --alias <alias>              Alias for webpack resolve. (A json file | name=path,name=path)
    -s, --splitChunks                https://webpack.js.org/plugins/split-chunks-plugin/
    -w, --watch                      Turn on watch mode.
    -h, --help                       output usage information
```

## 命令

```bash
xbundle [options]
```

#### -V, --version

输出当前xbundle的版本。

#### -c, --config

指定配置文件。虽然xbundle的目标是没有配置，但是你你也可以使用配置文件来处理比较复杂的配置。

`xbundle -c xbundle.config.js`

```javascript
/**
 * use config file.
 * 
 * @mode
 * @entry
 * @output
 * @watch
 * @modifyVars
 * @analyze
 * @jsx
 * @babelPolyfill
 */
module.exports = {
  entry: 'src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  jsx: true,
  modifyVars: path.resolve(__dirname, 'theme', 'index.less'),
  alias: {
    'pengjiyuan': path.resolve(__dirname, 'alias/pengjiyuan.js')
  }
}
```

#### --root

webpack.resolve.modules, 相对于当前运行目录.

```bash
xbundle --root ..
```

对应的webpack配置为

```javascript
{
  resolve: {
    modules: [path.resolve(process.cwd(), '..'), 'node_modules']
  }
}
```

#### --ay, --analyze

展示可视化的打包信息. 
https://github.com/webpack-contrib/webpack-bundle-analyzer

#### --mv, --modifyVars [filePath]

Enables run-time modification of Less variables (Less).
在Less打包的时候使用`modifyVars`来进行变量替换。
`filePath`可以是一个less文件或者json文件。

比如：

```bash
xbundle -e list --mv ./theme/index.less
# or
xbundle -e list --mv ./theme/theme.json
```

#### --bp, --babelPolyfill

在打包的时候使用babel-polyfill，如果你在写react应用的话，你可能需要打开这个配置。

#### --pfx, --prefix [value]

给打包的文件名添加前缀. (默认: '')

```bash
# prefix: zh-CN

# 生产模式
[hash:6].zh-CN.min.js

# 开发模式
zh-CN.min.js
```

#### -e, --entry [filename | directory | mixed]

指定xbundle的入口. (默认: 'bundle=./src/index.js')

打包后的文件需要一个名字，所以entry的格式是这样的 `name=filename`.

以下是entry支持的几种形式：

* 文件名

  ```bash
  xbundle -e home=entry/index.js
  ```
* 目录

  你可以直接指定一个目录为入口，xbundle会自动寻找入口文件`index.js | index.jsx`.

  比如你的文件目录是这样的：
  ```
  my-app
  ├── node_modules
  ├── package.json
  └── entry
      └── index.js
  ```
  ```bash
  xbundle -e bundle=entry
  ```

  如果你的文件目录是这样的：
  ```
  my-app
  ├── README.md
  ├── node_modules
  ├── package.json
  └── applications
      ├── about
      │   └── index.js
      └── home
          └── index.js
  ```

  如果文件目录如上所示，那么你不需要指定name了，`about`和`home`会被自动当作打包后的名字。

  ```bash
  xbundle -e applications
  ```
* 混合使用

  ```bash
  xbundle -e home=src/index.js,applications
  ```

#### -p, --path [value]

`Default: './dist'`

指定xbundle打包后的输出目录。

#### -j, --jsx

指定entry的后缀名为jsx， `.jsx`.

#### -m, --mode [mode] (production | development)

`Defalut: production`

* production -- uglify code.
* development -- not uglify code

#### -a, --alias [alias]

指定webpack.resolve.alias， alias可以是一个json文件或者直接以这样的方式传入`moment=client/moment.js`.

```json
{
  "moment": "client/lib/monent.js"
}
```

```bash
xbundle -e applications -a alias.json
```

或者这样:

```bash
xbundle -e src -a moment=client/moment.js
```

#### -s, --splitChunks

使用splitChunks来进行代码分割.
https://webpack.js.org/configuration/optimization/#optimization-splitchunks

#### -w, --watch

开启监听模式.

#### -h, --help

输出帮助信息.

## LICENSE

[MIT](./LICENSE) © PengJiyuan
