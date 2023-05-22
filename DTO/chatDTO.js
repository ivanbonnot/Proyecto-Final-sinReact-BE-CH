const factoryDAO = require("../DAO/factory");

const chats = factoryDAO()

const getAllChatsDTO = () => {
  const allChats = chats.getAllChats();
  return allChats;
};

const addChatDTO = (message) => {
  chats.saveChat(message);
  return;
};

module.exports = { getAllChatsDTO, addChatDTO };
