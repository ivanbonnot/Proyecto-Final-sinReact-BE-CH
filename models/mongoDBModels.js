const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose


const cartSchema = new Schema({
    userEmail: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    products: { type: Array, required: true },
    address: { type: String, required: true },
})

const orderSchema = new Schema({
    products: { type: Array, required: true },
    orderNumber: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'Generada' },
    userEmail: { type: String, required: true }
})

const chatSchema = new Schema({
    name: { type: String, require: true },
    text: { type: String, require: true },
    date: { type: Date, require: true },
});


const productschema = new Schema({
    timestamp: { type: Number, require: true },
    title: { type: String },
    thumbnail: { type: String },
    description: { type: String },
    stock: { type: Number },
    code: { type: String },
    price: { type: Number }
});


const userSchema = new Schema({
    timestamp: { type: Number, require: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
});


userSchema.pre('save', function (next) {
    const user = this;

    // Si la contraseña no se ha modificado, sigue adelante
    if (!user.isModified('password')) {
        return next();
    }

    // Genera un hash para la contraseña
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});


const cartModel = model('Cart', cartSchema)
const orderModel = model('Order', orderSchema)
const chatModel = model('Chat', chatSchema);
const productModel = model('Products', productschema)
const userModel = model('User', userSchema)

module.exports = { orderModel, cartModel, chatModel, productModel, userModel }