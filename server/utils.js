import crypto from 'crypto';
import config from 'config';

export function hash(text){
    const sha512 = crypto.createHash('sha512')
    sha512.update(text + config.hash_salt)
    return sha512.digest('hex')
}

export function getIP(req) {
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'];
    }
    if (req.connection && req.connection.remoteAddress) {
      return req.connection.remoteAddress;
    }
    if (req.connection.socket && req.connection.socket.remoteAddress) {
      return req.connection.socket.remoteAddress;
    }
    if (req.socket && req.socket.remoteAddress) {
      return req.socket.remoteAddress;
    }
    return '0.0.0.0';
};

export function generateRandomNumberString(length){
  let str = "";
  for(let i=0; i<length; i++){
    str += String(Math.floor(Math.random() * 10))
  }
  return str;
}