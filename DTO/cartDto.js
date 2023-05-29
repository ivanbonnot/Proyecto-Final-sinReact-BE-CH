const factoryDAO = require('../DAO/factory')

const cart = factoryDAO()
const orders = factoryDAO()


const getCartDto = async (username) => await cart.getCart(username)

const addProductToCartDto = async (itemId, number, username) => await cart.addProductToCart(itemId, number, username)

const deleteProductFromCartDto = async (itemId, username) =>  await cart.deleteProductFromCart(itemId, username)

const deleteCartDto = async (username) =>  await cart.deleteCart(username)

const newOrderDto = async (order) => {
  const response = await orders.newOrder(order)
  return response
}



module.exports = { getCartDto, addProductToCartDto, deleteProductFromCartDto, deleteCartDto, newOrderDto }

