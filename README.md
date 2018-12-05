# rpc-demo
node rpc demo

要手动实现rpc，需要再进一步熟悉[stream及实现双工流](https://github.com/Jmingzi/nodejs-learn/blob/master/%E5%9F%BA%E7%A1%80%E6%A8%A1%E5%9D%97/stream2.md)和熟练使用[buffer](https://github.com/Jmingzi/nodejs-learn/blob/master/%E5%9F%BA%E7%A1%80%E6%A8%A1%E5%9D%97/buffer.md)

如果与java通信，java一般采用的`netty` + `hessian`

【疑问】

- rpc通信需要认证吗？


【参考】

- 阿里[sofa-rpc-node](https://github.com/alipay/sofa-rpc-node)、协议[sofa-bolt-node](https://github.com/alipay/sofa-bolt-node)、操作buffer[byte](https://github.com/node-modules/byte)
- packetId相关[node-uuid](https://github.com/kelektiv/node-uuid)
