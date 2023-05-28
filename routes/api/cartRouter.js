const { Router } = require('express');
const sendMessage = require('../../helpers/twilioMessage')
const sendEmail = require('../../helpers/nodeMailer')
const logger = require('../../log/log4js')

const passport = require('../../middleware/auth')

const { getUserController } = require('../../controllers/usersControler');
const { getCartController, addProductToCartController, deleteProductFromCartController, deleteCartController, newOrderController } = require('../../controllers/cartController');
const { getProductByIdController } = require('../../controllers/productsController');
const { twilioWspNumber } = require('../../config/enviroment');
const cartRouter = Router();


cartRouter.get("/carrito", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { method, url } = req;

  try {
    const userEmail = req.user.username
    if (userEmail) {

      const user = await getUserController(userEmail);

      if (!user) {
        logger.error(`Ruta: ${url}, método: ${method}. No existe la cuenta`);
        return res.status(403).json({ result: "error" });
      }

      const cart = await getCartController(userEmail);
      return res.status(200).json(cart);

    } else {
      logger.error(`Ruta: ${url}, método: ${method}. Sesión no iniciada`);
      return res.status(403).json({ result: "error" });
    }
  } catch (error) {
    logger.error(`Error en la solicitud del carrito: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


cartRouter.post("/carrito", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { url, method, } = req;
  const userEmail = req.user.username

  try {
    const addProd = await addProductToCartController(req.query.itemId, parseInt(req.query.number), userEmail);
    logger.info(`El método y la ruta son: ${method} ${url} ${userEmail}.`);
    logger.info(addProd)
    res.json(addProd);

  } catch (error) {
    logger.error(`Error al agregar producto al carrito: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


cartRouter.delete("/carrito/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { url, method } = req;
  const userEmail = req.user.username

  try {
    if ( userEmail ) {
      const cart = await getCartController( userEmail );

      if (!cart) {
        logger.error(`El método y la ruta son: ${method} ${url}. Carrito no encontrado.`);
        res.status(404).json({ error: "Carrito no encontrado." });
        return;
      }

      const deleteProd = await deleteProductFromCartController(req.params.id, userEmail );

      logger.info(`El método y la ruta son: ${method} ${url}.`);
      res.json(deleteProd);
      return;
    }

    logger.error(`El método y la ruta son: ${method} ${url}. Intento de acceso sin logueo.`);
    res.redirect("/login");

  } catch (error) {
    logger.error(`Error en la solicitud: ${error}`);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


cartRouter.delete("/carrito", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { url, method } = req;
  const userEmail = req.user.username

  try {
    if (userEmail) {
      const cart = await getCartController(userEmail);

      if (!cart) {
        logger.error(`El método y la ruta son: ${method} ${url}. Carrito no encontrado.`);
        res.status(404).json({ error: "Carrito no encontrado." });
        return;
      }

      const deleteCart = await deleteCartController(userEmail)

      logger.info(`El método y la ruta son: ${method} ${url}.`);
      res.json(deleteCart);
      return;
    }

    logger.error(`El método y la ruta son: ${method} ${url}. Intento de acceso sin logueo.`);
    res.redirect("/login");

  } catch (error) {
    logger.error(`Error en la solicitud: ${error}`);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


cartRouter.get("/carrito/confirm", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { url, method } = req;

  const userEmail = req.user.username

  if (userEmail) {
    const user = await getUserController(userEmail);
    const cart = await getCartController(userEmail);

    let messageToSend = `Productos:`;
    let html = `<h1>Productos:</h1>`;

    for (const productCart of cart.products) {
      const product = await getProductByIdController(productCart.id);

      messageToSend += `
      - nombre: ${product.title}, precio: ${product.price}`;

      html += `
      <h2>- nombre: ${product.title}, precio: ${product.price}</h2>`;
    }

    await sendMessage(user.phone, messageToSend);

    await sendMessage(
      twilioWspNumber,
      messageToSend,
      true
    );

    await sendEmail(
      emailUser,
      messageToSend,
      `Nuevo pedido de ${user.username} - ${emailUser}`,
      html
    );

    res.send(messageToSend);
    return;
  }

  logger.error(
    `El método y la ruta son: ${method} ${url}. Intento de acceso sin loggueo.`
  );

  res.redirect("/login");
});


module.exports = cartRouter;
