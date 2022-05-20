const crypto = require('crypto');
const config = require('config');

module.exports.hash = (text) => {
    const sha512 = crypto.createHash('sha512')
    sha512.update(text + config.hash_salt)
    return sha512.digest('hex')
}