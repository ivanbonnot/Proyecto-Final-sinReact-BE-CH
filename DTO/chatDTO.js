const factoryDAO = require("../DAO/factory");

const chats = factoryDAO()

const getAllChatsDTO = () => chats.getAllChats();

const addChatDTO = (message) => chats.saveChat(message);
 
const deleteAllChatsDTO = () => chats.deleteAllChats()

module.exports = { getAllChatsDTO, addChatDTO, deleteAllChatsDTO };
