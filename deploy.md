# Deploy

bqliu

> @todo 增加 docker 版本部署。

## node

> 注意，easy mock打包需要使用 node 8.x，不然会报错，所以目前使用的是 `8.9.4`。

> ref http://www.runoob.com/nodejs/nodejs-install-setup.html

```bash
$ wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz
$ tar xf  node-v8.9.4-linux-x64.tar.xz
$ cd node-v8.9.4-linux-x64/ 
$ ./bin/node -v # 测试一下
# 解压文件的 bin 目录底下包含了 node、npm 等命令，我们可以使用 ln 命令来设置软连接：
$ ln -s /usr/software/nodejs/bin/npm usr/local/bin/ 
$ ln -s /usr/software/nodejs/bin/node /usr/local/bin/
```

### 使用 nvm

> 如果需要使用多个版本的 node，那可以使用 nvm 进行切换，目前我是使用 nvm 来做的。

> ref https://github.com/creationix/nvm/issues/1995

```bash
# ref https://github.com/creationix/nvm/blob/master/README.md#installation-and-update
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

编辑 `$NVM_DIR/default-packages`，加入你想假如的安装到 global 的包，这里我设置了 `pm2`。

```
pm2@2.10.4
```

然后：

```bash
$ nvm install stable
```

同样的，由于需要使用 `8.9.4`，所以可以这样：

```bash
$ nvm install v8.9.4
```

## mongodb

> ref http://www.runoob.com/mongodb/mongodb-linux-install.html

```bash
$ curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-4.0.8.tgz
$ tar -zxvf mongodb-linux-x86_64-4.0.8.tgz
# $ mv mongodb-linux-x86_64-4.0.8/ /usr/local/mongodb
$ mkdir -p <path/to/db>
$ cd mongodb-linux-install-x86_64-4.0.8
$ echo ... > mongodb.conf
$ ./bin/mongod --config mongod.conf # 启动
```

配置文件可以参考[这里](https://docs.mongodb.com/manual/reference/configuration-options/#configuration-file)，目前我用的配置文件如下：

```yml
systemLog:
   destination: file
   path: "/home/bqliu/mock/logs/mongodb/mongod.log"
   logAppend: true
storage:
  dbPath: "/home/bqliu/mock/data/db"
  journal:
      enabled: true
processManagement:
   fork: true
net:
   bindIp: 127.0.0.1
   port: 10241
setParameter:
   enableLocalhostAuthBypass: false
```

然后可以用 `mongo` 来测试连接：

```bash
$ ./bin/mongo --port <port>
```

## redis

> ref https://redis.io/download
> ref https://www.cnblogs.com/wangchunniu1314/p/6339416.html

```bash
$ wget http://download.redis.io/releases/redis-5.0.4.tar.gz
$ tar xzf redis-5.0.4.tar.gz
$ cd redis-5.0.4
$ make
$ src/redis-server -c 
$ src/redis-cli
```

修改 `redis.conf` 中的 port，至于其它的，我不会。

## pm2

> 当然你先要安装好 node。

```bash
$ npm i -g pm2^2.10.4 # >= 2.5.z，暂时不要用 3.0 之后的版本 @see https://github.com/Unitech/pm2/issues/4128
```

## easy mock

```bash
$ git clone https://github.com/easy-mock/easy-mock.git
$ cd easy-mock
$ npm i
$ echo ... > pm2.config.js # pm2 配置文件
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

修改 `config/default.json` 中的 `db` 为 `mongodb` 的地址，然后修改 `redis.port` 等为部署的 `redis` 的配置。

> `config/default.json` 和 `config/production.json` 都可以使用，参考 [node-config](https://github.com/lorenwest/node-config)
