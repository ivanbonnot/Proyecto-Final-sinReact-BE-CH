const morgan = require('morgan');
const express = require('express');
const compression = require('compression')
const logger = require('../log/log4js')
const expressSession = require('express-session')
const mongoStore = require('connect-mongo')
const { engine } = require('express-handlebars');
const path = require('path');


const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const { config, mongodbSecretPin, userSessionTime, mongodbUri } = require('../config/enviroment')

require('dotenv').config()

const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}


const baseProcces = () => {

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Process ${worker.process.pid} failure!`)
        cluster.fork()
    })

    const { Server: HTTPServer } = require('http');
    const { Server: IOServer } = require('socket.io');

    const infoRouter = require('../routes/api/infoRouter')
    const productsRouter = require("../routes/api/productRouter");
    const authWebRouter = require('../routes/web/authRouter')
    const homeWebRouter = require('../routes/web/homeRouter')
    const cartRouter = require("../routes/api/cartRouter")

    const connectToDb = require("../config/connectToDB");

    const app = express();


    const httpServer = new HTTPServer(app);
    const io = new IOServer(httpServer);

    const { addChatController, getAllChatsController, deleteAllChatsController } = require('../controllers/chatsController')

    //Settings
    app.engine('hbs', engine());
    app.set('view engine', 'hbs');
    //app.set('views', 'views');
    app.set('port', process.env.PORT || 8080)
    app.set('json spaces', 2)
    

    //Middlewares
    app.set(express.static(path.join(__dirname, 'public')));
    app.use(compression())
    app.use(morgan('dev'))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    //app.use(express.static(staticFiles))
    //app.use(express.static('./public'))


    app.use(expressSession({
        store: mongoStore.create({
            mongoUrl: mongodbUri,
            mongoOptions: advancedOptions
        }),
        secret: mongodbSecretPin,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: Number(userSessionTime)
        }
    }))


    const PORT = 8080
    const server = httpServer.listen(PORT, () => {
        connectToDb("mongo")
        logger.info(`Servidor http escuchando en el puerto ${server.address().port}`)
    })
    server.on('error', error => logger.error(`Error en servidor ${error}`))


    //Routes
    app.use("/", infoRouter)
    app.use("/", productsRouter)
    app.use("/", cartRouter)
    //__ WebServ Routes __//
    app.use("/", authWebRouter)
    app.use("/", homeWebRouter)


    //websocket
    io.on('connection', async socket => {
        logger.info('Nuevo cliente conectado!');
        // carga inicial de mensajes
        socket.emit('mensajes', await getAllChatsController());

        // actualizacion de mensajes
        socket.on('nuevoMensaje', async mensaje => {
            mensaje.date = new Date().toLocaleString()
            addChatController(mensaje)
            io.sockets.emit('mensajes', await getAllChatsController());
        })

        socket.on('borrarMensajes', async => {
            deleteAllChatsController()
            io.sockets.emit('mensajes', getAllChatsController());
        })
            
    });

}


if (config.mode != 'CLUSTER') {

    //-- Servidor FORK
    logger.info('Server en modo FORK')
    logger.info('-------------------')
    baseProcces()
} else {

    //-- Servidor CLUSTER   
    if (cluster.isPrimary) {
        logger.info('Server en modo CLUSTER')
        logger.info('----------------------')
        for (let i = 0; i < numCPUs; i++) { // creo tantos procesos como cpus tengo
            cluster.fork()
        }
    } else {
        baseProcces()
    }
}


