const parseArgs = require('minimist')(process.argv.slice(2)) // ejemplo -> nodemon src/server.js -p 8080 -m FORK
module.exports.config = {
  port: parseArgs.p, // puerto escucha
  mode: parseArgs.m, // mode 'FORK' (defecto) o 'CLUSTER'
  same: parseArgs.a // para CLUSTER puerto unico (defecto) o '1' puertos correlativos
}

require('dotenv').config()
module.exports.staticFiles = process.env.STATICFILES

module.exports.mongocredentialsession = process.env.MONGOCREDENTIALSESSION
module.exports.mongocredentialsecommerce = process.env.MONGOCREDENTIALSECOMMERCE

module.exports.usersessiontime = process.env.USER_SESSION_TIME
module.exports.jwtsecretkey = process.env.JWT_SECRET_KEY
module.exports.jwtexpires = process.env.JWT_EXPIRES

module.exports.emailservice = process.env.EMAILSERVICE
module.exports.emailport = process.env.EMAILPORT
module.exports.emailuser = process.env.EMAILUSER
module.exports.emailpass = process.env.EMAILPASS
module.exports.adminmail = process.env.ADMINMAIL

module.exports.msgaccountsid = process.env.TWILIO_ACCOUNT_SID
module.exports.msgauthtoken = process.env.TWILIO_AUTH_TOKEN
module.exports.smsnumber = process.env.TWILIO_TWILIO_NUMBER
module.exports.whatsappnumber = process.env.TWILIO_WSP_NUMBER

