require('dotenv').config();
const fetch = require('node-fetch');

class WeatherApi {
   constructor() {
      this.appId = process.env.WEATHER_APP_ID;
      this.errorMessage = {
         status: 404,
         message: "Weather data not found"
      }
   }

   async getWeatherByCity(name) {
      let urlResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${this.appId}`);
      let json = await urlResp.json();
      let returnWeather;

      if (json.status === "404" || json.status === "400")
         return this.errorMessage;
      else {
         if (json.name.toLowerCase() === name.toLowerCase()) {
            returnWeather = {
               country: json.sys.country,
               name: json.name,
               temp: json.main.temp,
               min_temp: json.main.temp_min,
               max_temp: json.main.temp_max,
               latitude: json.coord.lat,
               longitude: json.coord.lon
            }
         }
      }

      return returnWeather;
   }

   async getWeatherBySearch(search) {
      let {
         latitude: lat,
         longitude: lon,
         pin_code: zip
      } = search;
      let query;

      if (Object.keys(search).length) {
         if (lat && lon && zip)
            query = `lat=${latitude}&lon=${longitude}&zip=${zip},in`;
         else if (zip)
            query = `zip=${zip},in`;
         else if (lat && lon)
            query = `lat=${lat}&lon=${lon}`
      } else
         return this.errorMessage;

      let urlResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${this.appId}`);
      let json = await urlResp.json();
      let returnWeather;

      if (json.cod === "404" || json.cod === "400")
         returnWeather = this.errorMessage;
      else {
         returnWeather = {
            country: json.sys.country,
            name: json.name,
            temp: json.main.temp,
            min_temp: json.main.temp_min,
            max_temp: json.main.temp_max,
            latitude: json.coord.lat,
            longitude: json.coord.lon
         }
      }

      return returnWeather;
   }
}

module.exports = new WeatherApi();