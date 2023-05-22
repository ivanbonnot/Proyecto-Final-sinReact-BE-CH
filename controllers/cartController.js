const { getCartDto, addProductToCartDto, delProductFromCartDto, delCartDto, newOrderDto } = require('../DTO/cartDto')
const { getAllProductsController } = require('../controllers/productsController')
const sendEmail = require('../helpers/nodeMailer')
const { adminmail } = require('../config/environment')

const getCartController = ( username ) => getCartDto( username )

const addProductToCartController = ( itemId, number, username ) => addProductToCartDto( itemId, number, username )

const delProductFromCartController = ( itemId, username ) =>  delProductFromCartDto( itemId, username )

const delCartController = ( username ) => {
  const response =  delCartDto( username )
  return response
}

const newOrderController = ( username ) => {
  const cart =  getCartDto( username )
  if ( cart.products.length === 0 ) return false

  const products =  getAllProductsController()
  const orderArray = cart.products.map ( cartItem => {
    const productDetails = products.find( product => product.id === cartItem.id )
    return {
      ...cartItem,
      price: productDetails.price,
      title: productDetails.title
    }
  })
  const order = {
    username: username,
    sendaddress: cart.sendaddress,
    products: orderArray
  }
  const responseOrder =  newOrderDto( order )
  const responseDelete =  delCartDto( username )
  sendEmail({
    from: 'Administrador',
    to: adminmail,
    subject: 'Nuevo pedido',
    text: '',
    html: `
    <table>
      <tbody>
        <tr>
          <td>Username</td>
          <td>${username}</td>
        </tr>
        <tr>
          <td>Send address</td>
          <td>${cart.sendaddress}</td>
        </tr>
        <tr>
          <td>Products</td>
          <td>${JSON.stringify(orderArray)}</td>
        </tr>
      </tbody>
    </table>`
  })
  return ( responseOrder & responseDelete) ? true : false
}


module.exports = { getCartController, addProductToCartController, delProductFromCartController, delCartController, newOrderController }