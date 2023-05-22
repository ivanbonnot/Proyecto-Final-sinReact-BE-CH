const { Router } = require('express')
const path = require('path')
const homeWebRouter = Router()
const logger = require("../../log/log4js")


homeWebRouter.get('/', (req, res) => {
    try {
        const email = req.session.email
        logger.info("9", email)

        if (email) {
            res.render(path.join(process.cwd(), '../FrontEnd/views/home.ejs'), { email })
        } else {
            res.sendFile(path.join(process.cwd(), '../FrontEnd/views/login.ejs'))
            res.redirect('/login')
        }
    } catch {
        logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
})


module.exports = homeWebRouter