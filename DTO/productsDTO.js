const factoryDAO = require('../DAO/factory')

const products = factoryDAO()

const addNewProductDTO = async( prod ) => {
  console.log( prod )
  await products.saveProduct( prod )
  return 
}

const getAllProductsDTO = async() => {
  const allProducts = await products.getProducts()
  return allProducts
}

const getProductByIdDTO = async( id ) => {
  const productById = await products.getProductById( id )
  return productById
}

const updateProductDTO = async( id, prodToUpdate ) => {
  const productUpd = await products.updateProduct( id, prodToUpdate )
  return productUpd
}

const deleteProductDTO = async( id ) => {
  await products.deleteProduct( id )
  return 
}

const deleteAllProductsDTO = async() => {
  await products.deleteAllProducts()
  return 
}


module.exports = { getAllProductsDTO, getProductByIdDTO, deleteProductDTO, deleteAllProductsDTO, addNewProductDTO, updateProductDTO }

