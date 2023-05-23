const { Router } = require("express");
const {
  addNewProductController,
  getAllProductsController,
  getProductByIdController,
  deleteProductController,
  updateProductController,
} = require("../../controllers/productsController");

const productsRouter = Router();

const adm = true;

productsRouter.get("/", async (req, res) => {
  const products = await getAllProductsController();
  res.json({ products });
});

productsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const productById = await getProductByIdController(id);

  if (productById) {
    res.json(productById);
  } else {
    res.status(404).send({ error: "Product not found" });
  }
});

productsRouter.post("/", async (req, res) => {
  if (adm) {
    const { title, description, code, thumbnail, price, stock } = req.body;

    if (!title || !description || !code || !thumbnail || !price || !stock) {
      res.status(400).send({ error: "Falta completar campos" });
      return;
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
    res.send('Error: 403 Ruta: "api/products" Método: "POST" No Autorizada');
  }
});

productsRouter.put("/:id", async (req, res) => {
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
      res.send(productUpdate);
    } else {
      res.status(404).send({ error: "Product not found with ID: ${id}" });
    }
  } else {
    res.send(
      'Error: 403 Ruta: "api/products/:Id" Método: "PUT" No Autorizada '
    );
  }
});

productsRouter.delete("/:id", async (req, res) => {
  if (adm) {
    const { id } = req.params;
    const productById = await getProductByIdController(id);

    if (productById) {
     await deleteProductController(id);
      res.status(200).json({ deleted: true });
    } else {
      res.status(404).json({ error: "Product not found with ID: ${id}" });
    }
  } else {
    res.send(
      'Error: 403 Ruta: "api/products/:Id" Método: "DELETE" No Autorizada '
    );
  }
});

module.exports = productsRouter;
