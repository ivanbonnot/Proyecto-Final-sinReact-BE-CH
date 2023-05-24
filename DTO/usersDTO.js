const factoryDAO = require('../DAO/factory')

const users = factoryDAO()

const checkUserDTO = async( email ) => await users.getUserBy( email );

const addUserDTO = async( user) =>  await users.saveUser( user );


module.exports = { checkUserDTO, addUserDTO }

