const axios = require("axios");
const aqibot = require("aqi-bot");
const mongoose = require("mongoose");
const AqiData = require("./model");
require("dotenv").config();
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

(async function () {
  // CONNECT TO MongoDB
  await mongoose.connect(process.env.DB_URI, {
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
    const threshold = 119;
    if (aqiData.previousAqi <= threshold && aqiData.currentAqi > threshold) {
      const message = await client.messages.create({
        body: `CLOSE YOUR WINDOWS, QUICK! THE AQI IS ${aqi}!!!`,
        from: "+12056354950",
        to: "+14155138407",
      });
      console.log(message);
    } else if (
      aqiData.previousAqi >= threshold &&
      aqiData.currentAqi < threshold
    ) {
      const message = await client.messages.create({
        body: "FREEDOM, OPEN DEM WINDOWS!",
        from: "+12056354950",
        to: "+14157792256",
      });
      console.log(message);
    }
  } else {
    const myAqiData = [
      {
        currentAqi: aqi,
        previousAqi: 0,
        sensorID: sensorId,
        phoneNumber: "4157792256",
      },
    ];
    await AqiData.create(myAqiData);
    console.log("created");
  }

  console.log(aqiData);
})().then(() => process.exit(0));
