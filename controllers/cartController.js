const { getCartDto, addProductToCartDto, delProductFromCartDto, delCartDto, newOrderDto } = require('../DTO/cartDto')
const { getAllProductsController } = require('../controllers/productsController')
const sendEmail = require('../helpers/nodeMailer')
const { adminmail } = require('../config/environment')

const getCartController = ( userEmail ) => getCartDto( userEmail )

const addProductToCartController = ( itemId, number, userEmail ) => addProductToCartDto( itemId, number, userEmail )

const deleteProductFromCartController = ( itemId, userEmail ) =>  delProductFromCartDto( itemId, userEmail )

const deleteCartController = ( userEmail ) => delCartDto( userEmail )

const newOrderController = ( userEmail ) => {
  const cart =  getCartDto( userEmail )
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
    userEmail: cart.userEmail,
    products: orderArray
  }
  const responseOrder =  newOrderDto( order )
  const responseDelete =  deleteCartDto( userEmail )
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
  return ( responseOrder & responseDelete) ? true : false
}


module.exports = { getCartController, addProductToCartController, deleteProductFromCartController, deleteCartController, newOrderController }