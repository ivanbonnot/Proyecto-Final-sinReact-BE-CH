const { getAllProductsDTO, getProductByIdDTO, deleteProductDTO, addNewProductDTO, updateProductDTO } = require('../DTO/productsDTO')


const addNewProductController = (productToAdd) => addNewProductDTO(productToAdd)

const getAllProductsController = () => getAllProductsDTO()
 
const getProductByIdController = (id) => getProductByIdDTO(id)

const updateProductController = (id, productToUpdate) => updateProductDTO(id, productToUpdate)

const deleteProductController = (id) => deleteProductDTO(id)


module.exports = { addNewProductController, getAllProductsController, getProductByIdController, deleteProductController, updateProductController }