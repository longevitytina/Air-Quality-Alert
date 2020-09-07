const axios = require("axios");
const aqibot = require("aqi-bot");
const mongoose = require("mongoose");
const AqiData = require("./model");
const DB_URI = "mongodb://localhost:27017/airQuality";

(async function () {
  // CONNECT TO MongoDB
  await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  // monitor changes past a certain threshold
  const sensorId = 4372;
  const { data } = await axios.get(
    `https://www.purpleair.com/json?key=412TUD7OJINJU9ZL&show=${sensorId}`
  );
  const concentration = data.results[0].pm2_5_atm;
  const { aqi } = await aqibot.AQICalculator.getAQIResult(
    "PM2.5",
    concentration
  );
  console.log(aqi);

  const aqiData = await AqiData.findOne({ sensorID: sensorId }).exec();
  if (aqiData) {
    aqiData.previousAqi = aqiData.currentAqi;
    aqiData.currentAqi = aqi;
    await aqiData.save();
    console.log("updated");
    if (aqiData.previousAqi <= 75 && aqiData.currentAqi > 75) {
      console.log("CLOSE YOUR WINDOWS, QUICK!");
    } else if (aqiData.previousAqi >= 75 && aqiData.currentAqi < 75) {
      console.log(" FREEDOM, OPEN DEM WINDOWS!");
    }
  } else {
    const myAqiData = [
      {
        currentAqi: aqi,
        previousAqi: "TBD",
        sensorID: sensorId,
        phoneNumber: "TBD",
      },
    ];
    await AqiData.create(myAqiData);
    console.log("created");
  }

  console.log(aqiData);
})().then(() => process.exit(0));
