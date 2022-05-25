import crypto from 'crypto';
import config from 'config';

export function hash(text){
    const sha512 = crypto.createHash('sha512')
    sha512.update(text + config.hash_salt)
    return sha512.digest('hex')
}