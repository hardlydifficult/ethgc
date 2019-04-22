const characterSet =
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*?";

export default class Random {
  getRandomCode(length, addHypens) {
    let randomData = new Uint32Array(length);
    window.crypto.getRandomValues(randomData);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characterSet[randomData[i] % characterSet.length];
    }

    if (addHypens) {
      for (let i = addHypens; i < length; i += addHypens + 1) {
        result = result.slice(0, i) + "-" + result.slice(i);
      }
    }

    return result;
  }
}
