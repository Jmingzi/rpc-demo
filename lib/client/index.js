const net = require('net')
const Protocol = require('../protocol')
const protocol = new Protocol({
  packetType: 'request'
})
const uuidv1 = require('uuid/v1')

const defaultOptions = {
  version: '1.0.0',
  responseTimeout: 3000,
  connectTimeout: 3000,
  host: 'localhost',
  port: 8124,
  service: ''
}

class RpcClient {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options)

    this.client = net.createConnection(options.port, options.host, connectListener)
    this.serviceList = null
    this.callback = {}
    this.callbackId = ''

    function connectListener() {
      console.log('connected to server!')
    }

    this.handleFromServer()
    return this
  }

  call(apiName, args, callback) {
    // 校验apiName是否存在serviceList
    process.nextTick(() => {
      // console.log(this.serviceList)
    })
    // if (this.serviceList.indexOf(apiName) === -1) {
    //   console.log(`${apiName}方法不存在`)
    //   return
    // }
    // 此时需要生成callbackId一并发送给server
    this.callbackId = uuidv1()
    this.client.write(protocol.encode({
      type: 'call',
      value: { apiName, args },
      callbackId: this.callbackId
    }))
    this.callback[this.callbackId] = callback
  }

  handleFromServer() {
    this.client.on('data', chunk => {
      const result = protocol.decode(chunk)
      const { type, value, callbackId } = result.data

      if (protocol.isResponse(result.packetType)) {
        if (type === 'service') {
          this.serviceList = value
        } else if (type === 'call') {
          this.callback[callbackId](value)
        }
      }
    })
  }

  end() {

  }
}

module.exports = RpcClient
