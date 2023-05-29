const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const  logger  = require('../log/log4js')

const jwt = require('jsonwebtoken')
const { jwtSecret, jwtExpires } = require('../config/enviroment')
const { checkUserController, getUserController } = require("../controllers/usersControler");



passport.use(
  'login',
  new LocalStrategy(
    async function( username, password, done ) {
      const checkUser = await checkUserController (username, password)
      if ( checkUser.result ) {     
        return done( null, { username: username } )
      } else {
        logger.info(`Usuario o contrasena incorrectos.`)
        return done( null, false, { message: 'Nombre de usuario o contraseña incorrectos' } )
      }
    }
  )
)


passport.use(
  'register',
  new LocalStrategy(
    async ( username, password, done ) => {
      const checkUser = await checkUserController( username, password )

      if (checkUser.result === true) {
        logger.info(`Se intento registrar un usuario ya existente`)
        return done( null, false, { message: 'El email ya existe' } )
        
      } else {
        return done( null, { username: username } )
      }
    }
  )
)


passport.serializeUser( function(user, done) {
  done(null, user.username)
})

passport.deserializeUser( function(username, done) {
  done(null, { username: username })
})



//_____Autenticacion JWT_____//

passport.use('jwt', new JwtStrategy({ jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'), secretOrKey: jwtSecret },
  async (payload, done) => {
    try {
      const user = await getUserController(payload.username)
      return done(null, user !== null ? user : false)
    } catch (error) {
      return done(error, false)
    }
  }
)
)


const generateJwtToken = (username) => {
  const payload = {
    username: username
  }
  const options = {
    expiresIn: jwtExpires
  }
  return jwt.sign(payload, jwtSecret, options)
}


let deletedJWT = []

const destroyJWT = (token) => deletedJWT.push(token)

const isDeletedJWT = (req, res, next) => {
  if (deletedJWT.includes(req.headers.authorization)) {
    logger.warn(`JWT dejo de ser valido, token: ${req.headers.authorization}`)
    res.redirect(`info/error/JWT ya no es valido: ${req.headers.authorization}`)
  } else {
    next()
  }
}


module.exports =   {passport, generateJwtToken, destroyJWT,isDeletedJWT}
