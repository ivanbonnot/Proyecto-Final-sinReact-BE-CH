const parseArgs = require('minimist')(process.argv.slice(2)) // ejemplo -> nodemon src/server.js -p 8080 -m FORK

module.exports.config = {
  port: parseArgs.p, // puerto escucha
  mode: parseArgs.m, // mode 'FORK' (defecto) o 'CLUSTER'
  same: parseArgs.a // para CLUSTER puerto unico (defecto) o '1' puertos correlativos
}

require('dotenv').config()
module.exports.staticFiles = process.env.STATICFILES
module.exports.port = process.env.PORT

module.exports.mongodbUri = process.env.MONGODB_URI
module.exports.mongodbCredentialSession = process.env.MONGODB_CREDENTIAL_SESSION
module.exports.mongodbSecretPin =  process.env.MONGODB_SECRETPIN

module.exports.userSessionTime = process.env.USER_SESSION_TIME
module.exports.jwtSecret = process.env.JWT_SECRET
module.exports.jwtExpires = process.env.JWT_EXPIRES

module.exports.emailHost = process.env.EMAIL_HOST
module.exports.emailNodeMailer = process.env.EMAIL_NODEMAILER
module.exports.emailPassword = process.env.EMAIL_PASSWORD
module.exports.emailUser = process.env.EMAIL_USER
module.exports.emailAdmin = process.env.EMAIL_ADMIN

module.exports.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
module.exports.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
module.exports.twilioNumber = process.env.TWILIO_TWILIO_NUMBER
module.exports.twilioWspNumber = process.env.TWILIO_WSP_NUMBER

