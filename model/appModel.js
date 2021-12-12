const mongoose = require("mongoose");
const { DB_LINK } = require("../config/secret");
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => console.log("apod dB connected..!!"));

let apodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  imgAddres: {
    type: String,
  },
  copyrights: {
    type: String,
  },
  explanation: {
    type: String,
    required: true,
  },
});

let apodModel = mongoose.model("apodCollection", apodSchema);
module.exports = apodModel;
