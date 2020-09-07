const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AqiDataSchema = new Schema({
  currentAQI: String,
  previousAQI: String,
  sensorID: String,
  phoneNumber: String,
});

const AqiData = mongoose.model("AqiData", AqiDataSchema);
module.exports = AqiData;
