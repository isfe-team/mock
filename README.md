# Mock

本文档主要是描述我对于 Mock 的一些想法以及实践，可见[思路](https://www.processon.com/diagraming/5b83bc87e4b08faf8c36c2dc)。整体并没有非常高大上的工作，更多的是如何更好的利用已有工程信息，做到更好的 mock。

> 整体基于/涉及到以下工具/规范/相关概念：`ts` | `json-schema` | `typescript-json-schema` | `mockjs` | `easy-mock` | `redis` | `mongodb` | `open api spec` | `pm2`，相信有些同学看到这些就能知道整体思路了。

## Authors

@bqliu @hxli

## 背景

在开发过程中，我们总会需要去造一些假数据，也就是 Mock。一般 Mock 我们有以下几种做法：

1. 编写相应的假数据，一般 `json` 格式，然后直接响应/返回这个文件内容
2. 编写规则，同时有一个 Mock server 根据规则去生成假数据，然后客户端这边直接将特定的请求按照规则代理到相应的 Mock server

很明显，第一种做法很不容易维护和扩展，第二种做法更好一些，因为我们可以更灵活的*造假*。但是第二种，我们需要做的基础工作更多一些，一般我们可以将这些工作成为 Mock 工作流，并搭建相应的 Mock 平台。但是目前来说，我们在 Mock 上做的并不够。下面我们探讨一下动态的做法。

## 关键点

对于 Mock，我们需要考虑以下几点：

1. 如何知道返回什么样子的数据
2. 如何动态模拟数据，并能给与一定的限制
3. 如何灵活的进行配置和迁移
4. 是否可以更好的集成到工程中
5. 是否可以和更多的利用工程中的一些信息

对于问题4，我们的做法很简单，增加一些路由规则，将匹配到的进行中转/代理。

对于问题1、2、3，我们可以很自然的想到 `mockjs`，一个基于自己定义的模板，去生成随机数据，并支持一些占位符，功能很强大，我们可以很简单迁移模板。但是 `mockjs` 存在一个很严重的不足，那就是不支持第5点。

现在随着 `swagger` 等类似工具的兴起，很多项目会集成 `swagger`，但是基于 `mockjs` 的话，我们却无法使用对应的配置文件。我们必须得重新编写一套符合 `mockjs` 定义的模板（或者基于 `swagger.yml` 做一些变更）。

如果稍微再想想的话，会发现 `swagger.yml` 是一个完善的 api 配置文件（当然，可以参见[open api](https://swagger.io/docs/specification/about/))，其中包括了路径、入参、出参等。但是纯粹的 `swagger.yml` 这一配置文件，我们还得有一个生成数据的东西。很显然，那就是 `mockjs`。

上面引入了 `swagger` 和 `mockjs`，而且其实讨论的更多的是第5点。好的，原材料基本已经备好了，开始做菜了。

## 思路

我们可以通过工程生成 `swagger.yml`，然后将其解析，得到服务地址和参数定义，同时得到 `mockjs` 可识别的模板，最终通过 `mockjs` 造数据。嗯，就是这么简单。

当然有人会说，如果我们没有集成 `swagger` 呢？这就涉及到下面另一个东西了，非常重要的概念 ———— JSON schema。

具体的介绍就不多说了，可以看[这个](http://json-schema.org)。我们扩展一下，通过 `json-schema` 和 我们定义的请求配置文件，去造一个 `swagger.yml`，也就是加一个前置的流程。

最后，有人会说手写 schema 是一个很痛苦的事情！对，是的，很痛苦。那我们能不能简化呢？

当然可以，我们引入最后一个概念 ———— typescript。

ts 和这个有什么关系呢？

types！！

写简单的 ts 的 types 还是不难的，而且很易读，我们将 ts types 转成相对应的 json-schema 不就行了嘛~

> [Purpose] 如果在不久的将来，我们迁移到了 ts 开发，那我们就是能完全无缝迁移。

所以完整的路线是：[types ==> schema ==> + http-config ==> ]swagger.json/swagger.yml ==> Mock server

## 结论

综上，我们可以知道，其实我们需要的是一个能支持自定义模板、同时能支持 swagger 的 Mock 平台，且需要两个工具，将 ts-types 转成 schema，并将得到的 schema 和 http 配置文件 merge 生成 swagger 配置文件。

所以我们有了 `bin/merge.js` 和 `bin/ts-to-schemas.js`，还有 `Easy Mock`。

且总共支持以下特性：

- ts 和 请求定义 生成 `swagger.json`
- 下面是 Easy Mock 支持的[特性](https://github.com/easy-mock/easy-mock/blob/dev/README.zh-CN.md#%E7%89%B9%E6%80%A7)
  - 支持接口代理
  - 支持快捷键操作
  - 支持协同编辑
  - 支持团队项目
  - 支持 RESTful
  - 支持 Swagger | OpenAPI Specification (1.2 & 2.0 & 3.0)
    - 基于 Swagger 快速创建项目
    - 支持显示接口入参与返回值
    - 支持显示实体类
  - 支持灵活性与扩展性更高的响应式数据开发
  - 支持自定义响应配置（例：status/headers/cookies）
  - 支持 Mock.js 语法
  - 支持 restc 方式的接口预览

## TODOs

- 思考如何结合 `types` 生成的 `schema` 和 `占位符`

## 部署

> Platform: windows.

> you can see easy mock in [github](https://github.com/easy-mock/easy-mock) & see how they use [here](https://juejin.im/post/59a8f15ef265da246c4a3822#heading-6)

### Requirements

- `node.js >= 8.9`
- `MongoDB >=3.4`
- `Redis >= 4.0`

> 建议 Easy Mock 以及 MongoDB、Redis 尽量将其安装在一个目录中。

### Redis

1. 在[官网](https://github.com/MicrosoftArchive/redis/releases)下载安装包并解压

2. 在 `redis.wondows.conf` 中配置 `maxmemory` 和 `requirepass` 等，或者根据自身需求修改一些其它配置，可参照官网的 `redis` 配置

3. 启动服务，直接双击打开 `redis-server.exe`，默认端口是6379。

> 验证是否启动成功，也可以双击打开 `redis-cli.exe`，然后尝试一些基础命令，比如：`set <key> <value>` 回车后，再 `get <key>` 能得到设置的 `value`。

### MongoDB

1. 在[官网](https://www.mongodb.com/download-center/community)下载安装包并解压

2. 在解压后的文件夹内增加 `mongodb.cfg` 文件，里面配置如下内容：

```ini
dbpath=E:\mock\mongodb\data\db
logpath=E:\mock\mongodb\data\log\mongodb.log
```

注意此时需要保证相关路径准确。

3. 所有文件新建完成，在 `bin` 目录下执行命令 `mongod.exe --config ..\mongodb.cfg` 启动服务，然后可以使用 `mongo.exe` 进行测试连接。

### Easy Mock

```bash
$ git clone https://github.com/easy-mock/easy-mock.git
$ cd easy-mock
$ npm i
$ npm i -g pm2^2.10.4 # >= 2.5.z，不要用 3.0 之后的版本
$ echo ... > pm2.config.js # pm2 配置文件
$ pm2 start pm2.config.js --env production
```

```javascript
// pm2.config.js
module.exports = {
  apps: [
    {
      name: 'app',
      script: './app.js',
      watch: true,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
```

> 可修改 `config/default.json` 中配置 `host`、`redis-server` 的地址等。

### FTP client/server

1. 在[官网](https://filezilla-project.org/)下载 `filezilla client` 和 `filezilla server`

2. 首先安装 `filezilla server`，因为 `filezilla server` 没有免安装版，需要按照步骤安装

> 安装成功后默认输入的 `host` 不是本机 `ip`，`port` 为安装时定义的，默认是 `14147`，连接失败原因可能是 `host` 或 `port` 输入有误，或者服务未启动，需手动启动，直接在控制面板的服务内找到对应的 `filezilla server` 手动启动即可

3. 在 `filezilla server` 新建用户名和密码，在 `filezilla client` 中连接使用，直接解压 `filezilla client` 的压缩包，双击 `filezilla.exe`，连接时除了用户名和密码还需输入主机（服务器的 `ip`）， `port` 默认值是 `21`/`22`
