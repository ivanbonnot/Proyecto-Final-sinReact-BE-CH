const logger = require("../log/log4js");
const mongoose = require("mongoose");
const { mongodbUri } = require('./enviroment')

let isConnected;

const connectToDb = (db) => {
  if (!isConnected && db == "mongo") {
    try {
      mongoose.set("strictQuery", true);
      mongoose
        .connect(
          `${mongodbUri}`,
          { useNewUrlParser: true, useUnifiedTopology: true }
        )
        //user:pass@cluster0.xvejx.gcp.mongodb.net/test
        .then(() => {
          isConnected = true;
          logger.info("MongoDB Connected", isConnected);
        })
        .catch((err) => logger.error(err));
      return;
    } catch (e) {
      logger.warn(e.message);
    }
    return;
  }
};

module.exports = connectToDb;
