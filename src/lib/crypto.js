// Haha don't laugh, This is just a very simple encryption until I develop an E2EE algorithm.

function encrypt(str, key) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        let keyChar = key.charCodeAt(i % key.length);
        let encryptedChar = charCode ^ keyChar;
        result += String.fromCharCode(encryptedChar);
    }
    return result;
}

function decrypt(str, key) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        let keyChar = key.charCodeAt(i % key.length);
        let decryptedChar = charCode ^ keyChar;
        result += String.fromCharCode(decryptedChar);
    }
    return result;
}

export { encrypt, decrypt };