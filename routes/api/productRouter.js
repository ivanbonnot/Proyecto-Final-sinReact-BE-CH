const { Router } = require("express");
const {
  addNewProductController,
  getAllProductsController,
  getProductByIdController,
  deleteProductController,
  updateProductController,
} = require("../../controllers/productsController");

const productsRouter = Router();
const {passport, isDeletedJWT} = require('../../middleware/auth')
const logger = require('../../log/log4js')

const adm = true;


productsRouter.get("/productos", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const products = await getAllProductsController();
    res.json({ products });

  } catch (error) {
    logger.error(`Error en la solicitud de productos: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


productsRouter.get("/productos/:id", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
  const {method, url} = req
  const { id } = req.params;

  try {
    const productById = await getProductByIdController(id);

    if (productById) {
      res.json(productById);
    } else {
      logger.error(`Ruta: ${url}, método: ${method}. No existe el producto:${id}`);
      return res.status(403).json({ result: "error" });
    }

  } catch (error) {
    logger.error(`Error en la solicitud de producto por id: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


productsRouter.post("/productos", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
  const {method, url} = req

  try {
    if (adm) {
      const { title, description, code, thumbnail, price, stock } = req.body;

      if (!title || !description || !code || !thumbnail || !price || !stock) {
        return res.status(400).json({ error: "Falta completar campos" });
      }

      const product = {
        timestamp: Date.now(),
        title,
        description,
        code,
        thumbnail,
        price,
        stock,
      };

      await addNewProductController(product);
      res.json(product);
    } else {
      logger.error(`Ruta: ${url}, método: ${method}. Usuario no autorizado`);
      return res.status(403).json({ result: "error" });
    }

  } catch (error) {
    logger.error(`Error al crear producto: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


productsRouter.put("/productos/:id", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
  const {method, url} = req

  try {
    if (adm) {
      const { id } = req.params;
      const { title, description, code, thumbnail, price, stock } = req.body;

      const productUpdate = {
        timestamp: Date.now(),
        title,
        description,
        code,
        thumbnail,
        price,
        stock,
      };

      const productById = await getProductByIdController(id);

      if (productById) {
        await updateProductController(id, productUpdate);
        res.json(productUpdate);
      } else {
        logger.error(`Ruta: ${url}, método: ${method}. No existe el producto:${id}`);
        return res.status(403).json({ result: "error" });
      }
    } else {
      logger.error(`Ruta: ${url}, método: ${method}. Usuario no autorizado`);
      return res.status(403).json({ result: "error" });
    }

  } catch (error) {
    logger.error(`Error al actualizar el producto: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


productsRouter.delete("/productos/:id", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
const {method, url} = req

  try {
    if (adm) {
      const { id } = req.params;
      const productById = await getProductByIdController(id);

      if (productById) {
        await deleteProductController(id);
        res.status(200).json({ deleted: true });
      } else {
        logger.error(`Ruta: ${url}, método: ${method}. No existe el producto:${id}`);
        return res.status(403).json({ result: "error" });
      }
    } else {
      logger.error(`Ruta: ${url}, método: ${method}. Usuario no autorizado`);
      return res.status(403).json({ result: "error" });
    }

  } catch (error) {
    logger.error(`Error al borrar el producto: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


module.exports = productsRouter;
