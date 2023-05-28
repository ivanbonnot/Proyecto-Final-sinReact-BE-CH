const factoryDAO = require('../DAO/factory')

const carts = factoryDAO()


const getCartDto = async (username) => await carts.getCart(username)

const addProductToCartDto = async (itemId, number, username) => await carts.addProductToCart(itemId, number, username)

const deleteProductFromCartDto = async (itemId, username) =>  await carts.deleteProductFromCart(itemId, username)

const deleteCartDto = async (username) =>  await carts.deleteCart(username)

const newOrderDto = async (order) => {
  const orders = factoryDAO()
  const response = await orders.newOrder(order)
  return response
}



module.exports = { getCartDto, addProductToCartDto, deleteProductFromCartDto, deleteCartDto, newOrderDto }

