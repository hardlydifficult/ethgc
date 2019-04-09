/**
 * Removing:
0/o/O
1/i/l/L
5/s/S
u/v/U/V
2/z/Z

TODO change
4/A

TODO add
b/G/6
g/q/9
  */
const characterSet = "bcdefghjkmnpqrtwxy36789";

export default class Random {
  getRandomCode(length, addHypens) {
    let randomData = new Uint32Array(length);
    window.crypto.getRandomValues(randomData);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characterSet[randomData[i] % characterSet.length];
    }

    if (addHypens) {
      for (let i = 4; i < length; i += 5) {
        result = result.slice(0, i) + "-" + result.slice(i);
      }
    }

    return result;
  }
}
