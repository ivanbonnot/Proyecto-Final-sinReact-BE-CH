const { getCartDto, addProductToCartDto, deleteProductFromCartDto, deleteCartDto, newOrderDto } = require('../DTO/cartDto')
const { getAllProductsController } = require('../controllers/productsController')
const sendEmail = require('../helpers/nodeMailer')
const { emailAdmin, emailNodeMailer } = require('../config/enviroment')

const getCartController = (userEmail) => getCartDto(userEmail)

const addProductToCartController = (itemId, number, userEmail) => addProductToCartDto(itemId, number, userEmail)

const deleteProductFromCartController = (itemId, userEmail) => deleteProductFromCartDto(itemId, userEmail)

const deleteCartController = (userEmail) => deleteCartDto(userEmail)

const newOrderController = async (userEmail) => {

  const cart = await getCartDto(userEmail)

  if (cart.products.length === 0) return false

  const products = await getAllProductsController()
  const orderArray = cart.products.map(cartItem => {
    const productDetails = products.find(product => product.id === cartItem.id)
    return {
      ...cartItem,
      price: productDetails.price,
      title: productDetails.title
    }
  })
  const order = {
    userEmail: cart.userEmail,
    products: orderArray
  }
  const responseOrder = await newOrderDto(order)
  //const responseDelete =  await deleteCartDto( userEmail )
  let messageToSend = ''
  let html = `
  <table>
    <tbody>
      <tr>
        <td>Email del usuario</td>
        <td>${cart.userEmail}</td>
      </tr>
      <tr>
        <td>Products</td>
        <td>${JSON.stringify(orderArray)}</td>
      </tr>
    </tbody>
  </table>`

  await sendEmail(
    emailAdmin,
    messageToSend,
    `Nuevo pedido de ${userEmail}`,
    html
  )

  return responseOrder
  // && responseDelete

}


module.exports = { getCartController, addProductToCartController, deleteProductFromCartController, deleteCartController, newOrderController }

/*
sendEmail({
  from: 'Administrador',
  to: emailNodeMailer,
  subject: 'Nuevo pedido',
  text: '',
  html: `
  <table>
    <tbody>
      <tr>
        <td>Username</td>
        <td>${userEmail}</td>
      </tr>
      <tr>
        <td>Email del usuario</td>
        <td>${cart.userEmail}</td>
      </tr>
      <tr>
        <td>Products</td>
        <td>${JSON.stringify(orderArray)}</td>
      </tr>
    </tbody>
  </table>`
})

*/