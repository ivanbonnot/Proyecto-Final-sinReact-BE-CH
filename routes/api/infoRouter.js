const { Router } = require('express');
const infoRouter = Router();
const logger = require('../../log/log4js')
const { port,
    mongodbCredentialSession,
    emailAdmin,
    userSessionTime } = require('../../config/enviroment');

infoRouter.get('/info', async (req, res) => {
    try {
        const environment = {
            port,
            mongodbCredentialSession,
            emailAdmin,
            userSessionTime
        }
        
        res.render('info.hbs', { environment });
        logger.info(`Ruta: /info, metodo: ${req.method}`)

    } catch (error) {
        logger.error(`Error en la solicitud de info del servidor: ${error}`);
        return res.status(500).json({ result: "error" });
    }
})

module.exports = infoRouter