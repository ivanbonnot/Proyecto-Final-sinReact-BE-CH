const { productModel, cartModel, userModel, chatModel, orderModel } = require("../models/mongoDBModels")
const logger = require('../log/log4js')
const bcrypt = require('bcrypt')

class mongoDBDAO {

    //___USER__//

    addUser = async (userToAdd) => {
        const user = new userModel(userToAdd);
        await user.save();

        const newCart = new cartModel({ // nuevo cart
            userEmail: user.username,
            products: [],
            address: user.address
        })
        await newCart.save()
    };

    getUsers = async () => await userModel.find({});

    checkUser = async (username, password) => {
        try {
            const userExist = await userModel.findOne({ username: username })
            if (userExist !== null) {
                if (bcrypt.compareSync(password, userExist.password)) {
                    return { msg: 'Usuario y contrasena correctos', result: true }
                } else {
                    logger.info(`Se ha intentado logear ${username} con una contrasena incorrecta`)
                    return { msg: 'Contrasena incorrecta', result: false }
                }
            }
            return { msg: 'No existe usuario', result: false }
        } catch (err) {
            logger.error(`Error: ${err}`)
        }
    }

    async getUserBy(username) {
        try {
            const userExiste = await userModel.findOne({ username: username })
            return userExiste ? userExiste : null
        } catch (err) {
            logger.error(`Error: ${err} al intentar recuperar el usuario id:${username} de la base de datos`)
            return null
        }
    }

    deleteUser = async (id) => await userModel.deleteOne({ _id: id });

    updateUser = async (id, userToUpdate) => {
        return await userModel.updateOne(
            { _id: id },
            { $set: { ...userToUpdate } }
        );
    };

    //___PRODUCT___//

    saveProduct = async (productToAdd) => {
        const product = new productModel(productToAdd);
        await product.save();
        console.log("guardado", product)
    };

    getProducts = async () => await productModel.find({});

    getProductById = async (id) => await productModel.findOne({ _id: id });

    deleteProduct = async (id) => await productModel.deleteOne({ _id: id });

    deleteAllProducts = async () => await productModel.deleteMany();

    updateProduct = async (id, productToUpdate) => {
        return await productModel.updateOne(
            { _id: id },
            { $set: { ...productToUpdate } }
        );
    };



    //___CART___//

    async newCart(username, adress) {
        try {
            const newCart = new cartModel({
                userEmail: username,
                products: [],
                adress: adress
            })
            return await newCart.save()

        } catch (error) {
            logger.error(error)
        }
    }


    async getCart(username) {
        try {
            return await cartModel.findOne({ userEmail: username })
        } catch (error) {
            logger.warn(`Error: ${error} al recuperar cart.`)
            return false
        }
    }


    async addProductToCart(itemId, number, username) {
        try {
            const response = await cartModel.findOneAndUpdate(
                { userEmail: username, "products.id": itemId },
                { $inc: { "products.$.number": number } },
                { new: true }
            )
            if (!response) {
                await cartModel.findOneAndUpdate(
                    { userEmail: username },
                    { $push: { products: { id: itemId, number: number } } },
                    { new: true }
                )
            }
            return true
        } catch (err) {
            logger.warn(`Error: ${err} al agregar el producto al cart`)
            return false
        }
    }


    async deleteProductFromCart(itemId, username) {
        try {
            const response = await cartModel.findOneAndUpdate(
                { username: username },
                { $pull: { products: { id: itemId } } },
                { new: true }
            )
            return response ? true : false
        } catch (err) {
            logger.warn(`Error: ${err} al borrar el producto del cart.`)
            return false
        }
    }


    async deleteCart(username) {
        try {
            const response = await cartModel.findOneAndUpdate(
                { userEmail: username },
                {
                    $set: {
                        products: [],
                        timestamp: new Date().getTime()
                    }
                }
            )
            return response ? true : false
        } catch (error) {
            logger.warn(`Error: ${error} al borrar cart`)
            return false
        }
    }

    async newOrder(order) {
        try {
            const orderNumber = await orderModel.countDocuments()
            const newOrder = new orderModel({ ...order, orderNumber: orderNumber + 1 })
            await newOrder.save()
                .then(order => logger.info(`Se ha agregado a la base de datos orden de compra con id: ${order._id}`))
                .catch(err => logger.warn(`Se ha produciodo error ${err} al intentar crear una nueva orden de compra`))
            return true
        } catch (err) {
            logger.warn(`Error: ${err} al intentar crear el pedido.`)
            return false
        }
    }



    //___CHATS___//

    async getAllChats() {

        const array = {
            id: "123",
            mensajes: [],
        };

        const mensajes = await chatModel.find({})

        mensajes.forEach((mensaje) => {
            array.mensajes.push(mensaje._doc)
        })

        return array
    }


    async saveChat(mensaje) {
        try {
            const chat = new chatModel(mensaje);
            await chat.save();
            console.log("guardado", chat)
            return
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    async deleteAllChats() {
        try {
            await chatModel.deleteMany();
        } catch (error) {
            console.log(`Error: ${error}`)
        }

    }

}

module.exports = mongoDBDAO;
