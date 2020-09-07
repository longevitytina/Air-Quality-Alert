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

  const { data } = await axios.get(
    "https://www.purpleair.com/json?key=412TUD7OJINJU9ZL&show=4372"
  );
  const concentration = data.results[0].pm2_5_atm;
  // .then((response) => {
  //   console.log(response.data.results[0].pm2_5_atm);
  //   return response.data.results[0].pm2_5_atm;
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
  const { aqi } = await aqibot.AQICalculator.getAQIResult(
    "PM2.5",
    concentration
  );
  console.log(aqi);

  // const myAqiData = [
  //   {
  //     currentAQI: aqi,
  //     previousAQI: "TBD",
  //     sensorID: "TBD",
  //     phoneNumber: "TBD",
  //   },
  // ];
  // AqiData.create(myAqiData, (err, newAqi) => {
  //   if (err) {
  //     console.log(err);
  //     process.exit();
  //   }
  //   console.log("Made Aqi!", newAqi);
  //   process.exit();
  // });
  AqiData.find((err, Aqis) => {
    console.log(Aqis);
    process.exit();
  });
})();
