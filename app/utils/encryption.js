import CryptoJS from 'crypto-js';

const secretKey = 'finEdgeSecret123';

export const encrypt = (text) => CryptoJS.AES.encrypt(text, secretKey).toString();

export const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
