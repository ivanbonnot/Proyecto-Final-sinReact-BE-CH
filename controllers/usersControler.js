const { checkUserDTO, getUserDTO, addUserDTO } = require('../DTO/usersDTO')


const checkUserController =( username, password ) => checkUserDTO( username, password )

const getUserController = ( username ) => getUserDTO ( username )

const newUserController = ( user ) => addUserDTO ( user )


module.exports = { checkUserController, getUserController, newUserController }