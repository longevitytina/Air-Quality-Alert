const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AqiDataSchema = new Schema({
  currentAqi: Number,
  previousAqi: Number,
  sensorID: Number,
  phoneNumber: String,
});

const AqiData = mongoose.model("AqiData", AqiDataSchema);
module.exports = AqiData;
