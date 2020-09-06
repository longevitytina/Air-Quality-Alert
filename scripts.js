const axios = require("axios");
let aqibot = require("aqi-bot");

(async function () {
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

  //   aqibot.AQICalculator.getAQIResult("PM2.5", concentration)
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
})();
