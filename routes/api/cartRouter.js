const { Router } = require('express');
const sendMessage = require('../../helpers/twilioMessage')
const sendEmail = require('../../helpers/nodeMailer')
const logger = require('../../log/log4js')
const { checkUserController } = require('../../controllers/usersControler');
const { getCartController, addProductToCartController, deleteProductFromCartController, deleteCartController, newOrderController } = require('../../controllers/cartController');
const cartRouter = Router();


cartRouter.get("/", async (req, res) => {
  const { method, url } = req;

  try {
    if (req.session.email) {
      const email = req.session.email;
      const user = await checkUserController(email);

      if (!user) {
        logger.error(`Ruta: ${url}, método: ${method}. No existe la cuenta`);
        return res.status(403).json({ result: "error" });
      }

      const cart = await getCartController(email);
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


cartRouter.post("/", async (req, res) => {
  const { url, method } = req;

  try {
    if (req.session.email) {
      const addProd = await addProductToCartController(req.query.itemId, parseInt(req.query.number), req.session.email);
      logger.info(`El método y la ruta son: ${method} ${url}.`);
      return res.json(addProd);
    }

    logger.error(`El método y la ruta son: ${method} ${url}. Sesión no iniciada.`);
    return res.redirect("/login");

  } catch (error) {
    logger.error(`Error al agregar producto al carrito: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});



cartRouter.delete("/:id", async (req, res) => {
  const { url, method } = req;

  try {
    if (req.session.email) {
      const cart = await getCartController(req.session.email);

      if (!cart) {
        logger.error(`El método y la ruta son: ${method} ${url}. Carrito no encontrado.`);
        res.status(404).json({ error: "Carrito no encontrado." });
        return;
      }

      const deleteProd = await deleteProductFromCartController(req.params.id, req.session.email);

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


cartRouter.delete("/", async (req, res) => {
  const { url, method } = req;

  try {
    if (req.session.email) {
      const cart = await getCartController(req.session.email);

      if (!cart) {
        logger.error(`El método y la ruta son: ${method} ${url}. Carrito no encontrado.`);
        res.status(404).json({ error: "Carrito no encontrado." });
        return;
      }

      const deleteCart = await deleteCartController(req.session.passport.user)

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


cartRouter.get("/confirm", async (req, res) => {
  const { url, method } = req;

  if (req.session.email) {
    const emailUser = req.session.email;

    const user = await dbController.getUser(emailUser);
    const cart = await dbController.getCartById(user.cartId);

    let messageToSend = `Productos:`;
    let html = `<h1>Productos:</h1>`;

    for (const productCart of cart.productos) {
      const product = await dbController.getProductById(productCart.id);

      messageToSend += `
      - nombre: ${product.title}, precio: ${product.price}`;

      html += `
      <h2>- nombre: ${product.title}, precio: ${product.price}</h2>`;
    }

    await sendMessage(user.phone, messageToSend);

    await sendMessage(
      process.env.WSP_NUMbER,
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
