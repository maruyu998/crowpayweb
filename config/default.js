const secret = require('./secret');

module.exports = {
  session_secret: secret.session_secret,
  hash_salt: secret.hash_salt,
  basic_auth_username: secret.basic_auth_username,
  basic_auth_password: secret.basic_auth_password,
  mongo_path: secret.mongo_path,
  webpush_public_key: secret.webpush_public_key,
  webpush_private_key: secret.webpush_private_key
}
