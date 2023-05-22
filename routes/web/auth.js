const { Router } = require('express')
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const logger = require("../../log/log4js")

const { checkUserController, newUserController } = require('../../controllers/usersControler')
require('../../middleware/auth');

const authWebRouter = Router()
authWebRouter.use(flash())


//__LOGIN__//

authWebRouter.get('/login', (req, res) => {
    try {
        const nombre = req.session.email
        if (nombre) {
            res.redirect('/')
        } else {
            res.render(path.join(process.cwd(), '../FrontEnd/views/login.ejs'), { message: req.flash('error') })
        }
    } catch {
        logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
})


authWebRouter.post('/login', passport.authenticate('login', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    try {
        req.session.email = req.user.email;
        res.redirect('/')
    } catch {
        logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
});


//__REGISTER__//

authWebRouter.get('/register', (req, res) => {
    try {
        const nombre = req.session.email
        if (nombre) {
            res.redirect('/')
        } else {
            res.render(path.join(process.cwd(), '../FrontEnd/views/register.ejs'), { message: req.flash('error') })
        }
    } catch {
        logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
})


authWebRouter.post('/register', passport.authenticate('register', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    try {
        req.session.username = req.user.username;
        const { username, email, password, address, phone, avatar } = req.body;

        const user = await checkUserController(email)

        if (user) {
            console.log("usuario existente ")
        } else {

            const newUser = {
                timestamp: Date.now(),
                username,
                password,
                email,
                address,
                phone,
                avatar,
                cartId: cart._id,
            }

            await newUserController(newUser)
        }

        res.redirect('/login');
    } catch {
        logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
});



//__LOGOUT__//

authWebRouter.get('/logout', (req, res) => {
    try {
        const nombre = req.session.email
        if (nombre) {
            req.session.destroy(err => {
                if (!err) {
                    res.render(path.join(process.cwd(), '../FrontEnd/views/logout.ejs'), { nombre })
                } else {
                    res.redirect('/')
                }
            })
        } else {
            res.redirect('/login')
        }
    } catch {
        logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
})


module.exports = authWebRouter 
