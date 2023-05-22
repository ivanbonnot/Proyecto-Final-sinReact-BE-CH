const logger = require("./log/log4js");
const mongoose = require("mongoose");

let isConnected;

const connectToDb = (db) => {
  if (!isConnected && db == "mongo") {
    try {
      mongoose.set("strictQuery", true);
      mongoose
        .connect(
          `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xvejx.gcp.mongodb.net/test`,
          { useNewUrlParser: true, useUnifiedTopology: true }
        )

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
