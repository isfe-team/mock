# Easy Mock 简易部署文档

> Platform: windows.

> you can see easy mock in [github](https://github.com/easy-mock/easy-mock) & see how they use [here](https://juejin.im/post/59a8f15ef265da246c4a3822#heading-6)

> Rel: https://www.processon.com/diagraming/5b83bc87e4b08faf8c36c2dc

## Requirements

- `node.js >= 8.9`
- `MongoDB >=3.4`
- `Redis >= 4.0`

> 建议 Easy Mock 以及 MongoDB、Redis 尽量将其安装在一个目录中。

## 安装 

1. 在[官网](https://github.com/MicrosoftArchive/redis/releases)下载安装包并解压

2. 在 `redis.wondows.conf` 中配置 `maxmemory` 和 `requirepass` 等，或者根据自身需求修改一些其它配置，可参照官网的 `redis` 配置

3. 启动服务，直接双击打开 `redis-server.exe`，默认端口是6379。

> 验证是否启动成功，也可以双击打开 `redis-cli.exe`，然后尝试一些基础命令，比如：`set <key> <value>` 回车后，再 `get <key>` 能得到设置的 `value`。

## 安装 MongoDB

1. 在[官网](https://www.mongodb.com/download-center/community)下载安装包并解压

2. 在解压后的文件夹内增加 `mongodb.cfg` 文件，里面配置如下内容：

```ini
dbpath=E:\mock\mongodb\data\db
logpath=E:\mock\mongodb\data\log\mongodb.log
```

注意此时需要保证相关路径准确。

3. 所有文件新建完成，在 `bin` 目录下执行命令 `mongod.exe --config ..\mongodb.cfg` 启动服务，然后可以使用 `mongo.exe` 进行测试连接。

## 安装 Easy Mock

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
