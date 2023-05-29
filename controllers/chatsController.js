const { getAllChatsDTO, addChatDTO, deleteAllChatsDTO } = require('../DTO/chatDto')


const getAllChatsController = () =>  getAllChatsDTO()

const addChatController =  ( message ) => addChatDTO( message )

const deleteAllChatsController = () => deleteAllChatsDTO()

module.exports = { getAllChatsController, addChatController, deleteAllChatsController }