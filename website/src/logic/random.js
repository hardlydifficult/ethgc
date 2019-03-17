const characterSet = 'bcdefghjkmnpqrtwxyz2356789'

export default class Random {
  getRandomCode (length, addHypens) {
    let randomData = new Uint32Array(length)
    window.crypto.getRandomValues(randomData)
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characterSet[randomData[i] % 26]
    }

    if (addHypens) {
      for (let i = 4; i < length; i += 5) {
        result = result.slice(0, i) + '-' + result.slice(i)
      }
    }

    return result
  }
}
