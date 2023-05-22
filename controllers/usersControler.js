const { checkUserDTO, addUserDTO } = require('../DTO/usersDTO')


const checkUserController =( email ) => checkUserDTO( email )

const newUserController = ( user ) => addUserDTO ( user )


module.exports = { checkUserController, newUserController }