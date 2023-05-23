const factoryDAO = require('../DAO/factory')

const carts = factoryDAO()


const getCartDto = async (userEmail) => await carts.getCartByEmail(userEmail)

const addProductToCartDto = async (itemId, number, userEmail) => await carts.addProductToCart(itemId, number, userEmail)

const deleteProductFromCartDto = async (itemId, userEmail) =>  await carts.deleteProductFromCart(itemId, userEmail)

const deleteCartDto = async (userEmail) =>  await carts.deleteCart(userEmail)

const newOrderDto = async (order) => {
  const orders = factoryDAO()
  const response = await orders.newOrder(order)
  return response
}



module.exports = { getCartDto, addProductToCartDto, deleteProductFromCartDto, deleteCartDto, newOrderDto }

