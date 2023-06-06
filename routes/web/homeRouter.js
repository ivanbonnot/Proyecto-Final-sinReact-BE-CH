const { Router } = require('express')
const path = require('path')
const homeWebRouter = Router()
const logger = require("../../log/log4js")

const  { generateJwtToken }  = require('../../middleware/auth')


homeWebRouter.get('/', (req, res) => {
    
    try {
        const username = req.session.passport.user
        let userData = ''
        if (username) {
            logger.info(`Usuario ${username} logeado`)
            // userData = Object.assign({}, userData._doc, { token: generateJwtToken(username) })
            // logger.info(userData)
            //res.status(200).send(userData)
            res.render(path.join(process.cwd(), './public/views/home.ejs'), { username })
        } else {
            res.sendFile(path.join(process.cwd(), './public/views/login.ejs'))
            res.redirect('/login')
        }
    } catch(error) {
        logger.error(error);
        res.status(500).json('Error interno del servidor');
    }
})


module.exports = homeWebRouter