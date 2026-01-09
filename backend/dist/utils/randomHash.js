"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomHash = (len) => {
    let options = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let length = options.length;
    let randomString = "";
    for (let i = 0; i < len; i++) {
        randomString += options[Math.floor(Math.random() * length)];
    }
    return randomString;
};
exports.default = randomHash;
