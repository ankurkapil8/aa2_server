var CryptoJS = require("crypto-js");
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const encrypt = (text) => {
    var ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return ciphertext;
};

const decrypt = (hash) => {
    var bytes  = CryptoJS.AES.decrypt(hash, secretKey);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

module.exports = {
    encrypt,
    decrypt
};