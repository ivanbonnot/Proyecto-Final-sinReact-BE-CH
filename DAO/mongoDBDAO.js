const { productModel, cartModel, userModel, chatModel } = require("../models/mongoDBModels")
const logger = require('../../log/log4js')

class mongoDBDAO {

    //___USER__//

    saveUser = async (userToAdd) => {
        const user = new userModel(userToAdd);
        await user.save();
        console.log("guardado", user)
    };

    getUsers = async () => await userModel.find({});

    getUserBy = async (email) => await userModel.findOne({ email: email });

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

    async newCart(userEmail, adress) {
        try {
            const newCart = new cartModel({
                userEmail: userEmail,
                products: [],
                adress: adress
            })
            return await newCart.save()

        } catch (error) {
            logger.error(error)
        }
    }


    async getCart(userEmail) {
        try {
            return await cartModel.findOne({ userEmail: userEmail })
        } catch (error) {
            logger.warn(`Error: ${error} al recuperar cart.`)
            return false
        }
    }


    async addProductToCart(itemId, number, userEmail) {
        try {
            const response = await cartModel.findOneAndUpdate(
                { userEmail: userEmail, "products.id": itemId },
                { $inc: { "products.$.number": number } },
                { new: true }
            )
            if (!response) {
                await cartModel.findOneAndUpdate(
                    { userEmail: userEmail },
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


    async deleteCart(userEmail) {
        try {
            const response = await cartModel.findOneAndUpdate(
                { userEmail: userEmail },
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
}

module.exports = mongoDBDAO;
