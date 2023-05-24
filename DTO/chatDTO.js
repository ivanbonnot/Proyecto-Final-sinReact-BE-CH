const factoryDAO = require("../DAO/factory");

const chats = factoryDAO()

const getAllChatsDTO = () => chats.getAllChats();

const addChatDTO = (message) => chats.saveChat(message);
 

module.exports = { getAllChatsDTO, addChatDTO };
