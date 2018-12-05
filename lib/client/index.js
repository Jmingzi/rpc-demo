const net = require('net')

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
    this.serverFnList = null
    this.callback = null

    function connectListener() {
      console.log('connected to server!')
    }

    this.handleFromServer()

    return this
  }

  call(apiName, args, callback) {
    this.client.write(JSON.stringify({ apiName, args }))
    this.callback = callback
  }

  handleFromServer() {
    this.client.on('data', chunk => {
      const chunkParse = JSON.parse(chunk.toString())
      this.callback(chunkParse)
    })
  }

  end() {

  }
}

module.exports = RpcClient
