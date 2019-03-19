/**
 * Removing:
0/o
1/i/l
4/a
5/s
u/v
2/z
  */
const characterSet = 'bcdefghjkmnpqrtwxy36789'

export default class Random {
  getRandomCode (length, addHypens) {
    let randomData = new Uint32Array(length)
    window.crypto.getRandomValues(randomData)
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characterSet[randomData[i] % characterSet.length]
    }

    if (addHypens) {
      for (let i = 4; i < length; i += 5) {
        result = result.slice(0, i) + '-' + result.slice(i)
      }
    }

    return result
  }
}
