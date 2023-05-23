const factoryDAO = require('../DAO/factory')

const products = factoryDAO()


const addNewProductDTO = async( prod ) => await products.saveProduct( prod )

const getAllProductsDTO = async() => await products.getProducts()

const getProductByIdDTO = async( id ) => await products.getProductById( id )

const updateProductDTO = async( id, prodToUpdate ) => await products.updateProduct( id, prodToUpdate )

const deleteProductDTO = async( id ) => await products.deleteProduct( id )

const deleteAllProductsDTO = async() => await products.deleteAllProducts()



module.exports = { getAllProductsDTO, getProductByIdDTO, deleteProductDTO, deleteAllProductsDTO, addNewProductDTO, updateProductDTO }

