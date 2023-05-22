const { getAllChatsDTO, addChatDTO } = require('../DTO/chatDto')


const getAllChatsController = () =>  getAllChatsDTO()

const addChatController =  ( message ) => addChatDTO( message )


module.exports = { getAllChatsController, addChatController }