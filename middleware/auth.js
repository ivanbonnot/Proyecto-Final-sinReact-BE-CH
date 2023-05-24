const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')

const jwt = require('jsonwebtoken')
const { jwtSecret, jwtExpires } = require('../config/enviroment')

const { compareSync, hashSync } = require('bcrypt');
const { checkUserController } = require("../controllers/usersControler");

const users = [];
let userMongo = [];

passport.use('login', new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    const user = users.find(user => user.email === email && compareSync(password, user.password));
    const usersDB = await checkUserController(email)

    if (usersDB) {
        let userMongoDB = []
        userMongoDB.push(usersDB)
        userMongo = userMongoDB.find(user => user.email === email && compareSync(password, user.password));
    }

    if (user) {
        done(null, user);

    } else if (userMongo?.email) {
        done(null, userMongo);

    } else {
        done(null, false, { message: 'Nombre de usuario o contraseña incorrectos' });
    }

}));


passport.use('register', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
    const email = req.body.email
    const existentUser = users.find(user => user.username === username);

    if (existentUser) {
        done(null, false, { message: 'El usuario o el email ya existe' });
        return;
    }

    const user = { email, password: hashSync(password, 10) };
    users.push(user);
    done(null, user);
}));


passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    const user = users.find(user => user.email === email);
    done(null, user);
});


passport.use('jwt',new JwtStrategy({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),secretOrKey: jwtSecret},
      async (payload, done) => {
        try {
          const user = await checkUserController(payload.email)
          return done(null, user !== null ? user : false)
        } catch (error) {
          return done(error, false)
        }
      }
    )
  )
  
  
module.exports.generateJwtToken = ( email ) =>{
    const payload = {
      email: email
    }
    const options = {
      expiresIn: jwtExpires 
    }
    return jwt.sign(payload, jwtSecret, options)
  }