const { Router } = require('express')
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const logger = require("../../log/log4js")

const {  newUserController, getUserController } = require('../../controllers/usersControler')
require('../../middleware/auth');
const { generateJwtToken, destroyJWT } = require('../../middleware/auth')

const authWebRouter = Router()
authWebRouter.use(flash())


//__LOGIN__//

authWebRouter.get('/login', (req, res) => {
    try {
        const userEmail = req.session.user
        if (userEmail) {
            res.redirect('/')
        } else {
            res.render(path.join(process.cwd(), './public/views/login.ejs'), { message: req.flash('error') })
        }
    } catch(error) {
        logger.error(error);
        res.status(500).json('Error interno del servidor');
    }
})


authWebRouter.post('/login', passport.authenticate('login', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    try {
        req.session.passport.user = req.user.username
        let userData = await getUserController(req.session.passport.user)
        userData = Object.assign({}, userData._doc, { token: generateJwtToken(req.session.passport.user) })
        res.status(200).json(userData)
        //res.redirect('/')
    } catch(error) {
        logger.error(error);
        res.status(500).json('Error interno del servidor');
    }
});


//__REGISTER__//

authWebRouter.get('/register', (req, res) => {
    try {
        const nombre = req.session.user
        if (nombre) {
            res.redirect('/')
        } else {
            res.render(path.join(process.cwd(), './public/views/register.ejs'), { message: req.flash('error') })
        }
    } catch(error) {
        logger.error(error);
        res.status(500).json('Error interno del servidor');
    }
})


authWebRouter.post('/register', passport.authenticate('register', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    try {
        req.session.passport.user = req.user.username
        req.session.username = req.user.username;
        const { username, password, password_verification, address, phone } = req.body;

        const user = await getUserController(username)

        if (user) {
            logger.info("Usuario existente ")
        } else if (password === password_verification) {
            const newUser = {
                timestamp: Date.now(),
                username,
                password,
                address,
                phone
            }
            await newUserController(newUser)
            
        } else {
            logger.info("La contraseña no coincide")
            req.flash('error', 'La contraseña no coincide');
            return res.redirect('/register');
        }

        res.redirect('/login');
    } catch(error) {
        logger.error(error);
        res.status(500).json('Error interno del servidor');
    }
});



//__LOGOUT__//

authWebRouter.get('/logout', (req, res) => {
    try {
        const nombre = req.session.passport.user
        if (nombre) {
            destroyJWT(req.headers.authorization)
            console.log(req.headers)
            req.session.destroy(err => {
                if (!err) {
                    res.render(path.join(process.cwd(), './public/views/logout.ejs'), { nombre })
                } else {
                    res.redirect('/')
                }
            })
        } else {
            res.redirect('/login')
        }
    } catch(error) {
        logger.error(error);
        res.status(500).json('Error interno del servidor');
    }
})


module.exports = authWebRouter 
