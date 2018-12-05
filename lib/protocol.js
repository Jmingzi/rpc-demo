const protocolDefault = {
  packetId: 0,
  packetType: '',
  data: null,
  protocolType: 'node-rpc',
  timeout: 20000
}

// buffer.constants.MAX_LENGTH 2^30-1 / 2^31-1，也就是1G / 2G
const byteBuffer = Buffer.alloc(1024 * 1024)
let byteOffset = 0
let packetId = 0

class Protocol {
  constructor(options = {}) {
    this.options = Object.assign({}, protocolDefault, options)
    byteOffset = 0
    packetId = 0
    return this
  }

  encode(data) {
    byteOffset = 0

    if (data) {
      this.options = Object.assign(this.options, { data })
    }
    const { protocolType, packetType } = this.options
    // packetType
    byteBuffer.writeInt8(this.getPacketTypeNumber(packetType), byteOffset)
    byteOffset += 1
    // protocolType
    byteBuffer.write(protocolType, byteOffset)
    byteOffset += protocolType.length
    // packetId
    byteBuffer.writeUInt16BE(packetId, byteOffset)
    byteOffset += 4
    // 是否存在data
    if (data) {
      byteBuffer.writeInt8(1, byteOffset)
      byteOffset += 1

      const dataStr = JSON.stringify(data)
      const dataStrLen = dataStr.length
      // data.length
      // console.log(dataStrLen)
      byteBuffer.writeUInt16BE(dataStrLen, byteOffset)
      byteOffset += 4
      // data
      byteBuffer.write(dataStr, byteOffset)
      byteOffset += dataStrLen
    } else {
      byteBuffer.writeInt8(0, byteOffset)
      // byteOffset += 1
    }

    packetId += 1
    const newBuf = Buffer.alloc(byteOffset)
    byteBuffer.copy(newBuf, 0, 0, byteOffset)
    return newBuf
  }

  decode(buf) {
    const packetType = buf.readInt8(0)
    const protocolType = buf.slice(1, 9)
    const packetId = buf.readUInt16BE(9)
    const hasData = buf.readInt8(13)

    const ret = {
      packetType: this.getPacketType(packetType),
      protocolType: protocolType.toString(),
      packetId,
      hasData,
      data: null
    }

    if (hasData) {
      const dataLen = buf.readUInt16BE(14)
      const data = buf.slice(18, 18 + 1 + dataLen)
      // console.log(data.toString())
      ret.data = JSON.parse(data)
    }

    return ret
  }

  getPacketType(type) {
    return type === 1 ? 'request' : 'response'
  }

  getPacketTypeNumber(number) {
    return number === 'request' ? 1 : 2
  }

  isRequest(type) {
    return type === 'request' || type === 1
  }

  isResponse(type) {
    return type === 'response' || type === 2
  }
}

module.exports = Protocol
