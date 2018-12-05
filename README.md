# rpc-demo

### 资料整理

要手动实现rpc，需要再进一步熟悉[stream及实现双工流](https://github.com/Jmingzi/nodejs-learn/blob/master/%E5%9F%BA%E7%A1%80%E6%A8%A1%E5%9D%97/stream2.md)和熟练使用[buffer](https://github.com/Jmingzi/nodejs-learn/blob/master/%E5%9F%BA%E7%A1%80%E6%A8%A1%E5%9D%97/buffer.md)

如果与java通信，java一般采用的`netty` + `hessian`

【疑问】

- rpc通信需要认证吗？

    不需要认证的，因为是内部调用

【参考】

- 阿里[sofa-rpc-node](https://github.com/alipay/sofa-rpc-node)、协议[sofa-bolt-node](https://github.com/alipay/sofa-bolt-node)、操作buffer的模块[byte](https://github.com/node-modules/byte)
- packetId相关[node-uuid](https://github.com/kelektiv/node-uuid)

### demo详解

文件结构
```
.
├── README.md
├── example
│   ├── client.js
│   ├── index.html
│   ├── protocol.js
│   └── server.js
├── lib
│   ├── client
│   │   └── index.js    // 客户端实现
│   ├── index.js        // 对外暴露
│   ├── protocol.js     // 编码协议的实现
│   └── server
│       └── index.js    // 服务端实现
```

使用demo
```shell
# 启动server
node example/server.js

# 启动客户端
node example/client.js
```

客户端通过调用server上的`add`方法，拿到结果
```js
client.call('add', [1, 2], res => {
  console.log('local client callback result: ', res)
})
```

## 为什么要用rpc，而不是使用http？

这个问题应该是这样：为什么要使用自定义 tcp 协议的 rpc 做后端进程通信？

rpc概念上是远程过程调用，是一种软件结构的设计概念，而不是指的http协议。rpc可以用http，也可以用tcp实现，因为本质上http是基于tcp的。

所以要对比的不应该是rpc和http，而应该是采用何种架构？

rpc属于SOA分布式服务的一个重要组成部分，其分为2部分：

- 服务实现

    其协议也分为2部分：

    - 传输协议，包含 tcp / http / http2
    - 编码协议， 包含 json、二进制

    其中，编码内容是可以自定义header的，相比于http的header，自定义的会小很多。而编码协议http是相同的。

- 服务治理

    当然，如果你只是单纯的实现了协议部分，那其实是可以和http相比较的，优点在于自定义协议。而一个完整的rpc框架还需要包含服务的治理，例如：连接池的复用、心跳、服务注册发现、错误重试、服务的灰度发布、服务调用负载均衡等等。

    如果你用http的架构包含了上述，那也可以称之为rpc。

## rpc的适用场景

在服务数量庞大起来后，例如订单系统，支付系统，商品系统，用户系统等，都需要采用分布式架构单独处理子模块的测试与发布，当服务多了之后，就需要更成熟的服务治理，也就是rpc框架应该做的事情。

参考：

- [既然有 HTTP 请求，为什么还要用 RPC 调用？](https://www.zhihu.com/question/41609070)
- [为什么需要RPC，而不是简单的HTTP接口](https://www.cnblogs.com/winner-0715/p/5847638.html)
- [为什么要使用RPC框架](https://www.jianshu.com/p/d9b256776664)
