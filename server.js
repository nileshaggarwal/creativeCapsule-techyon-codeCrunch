const express = require('express'),
  app = express(),
  errorMessage = require('./errorMessages'),
  countryApi = require('./countryApi'),
  covidApi = require('./covidApi'),
  weatherApi = require('./weatherApi'),
  log = console.log;

app
  //countryApi
  .get('/country/name/:countryName', (req, res) => {
    countryApi.getCountryByName(req.params.countryName, "path")
      .then(data => res.send(JSON.stringify(data)))
      .catch(() => res.send(JSON.stringify(errorMessage.countryError)))
  })
  .get('/country/code/:countryCode', (req, res) => {
    countryApi.getCountryByCode(req.params.countryCode)
      .then(data => res.send(JSON.stringify(data)))
      .catch(() => res.send(JSON.stringify(errorMessage.countryError)))
  })
  .get('/country/search', (req, res) => {
    countryApi.getCountryBySearch(req.query.searchText)
      .then(data => res.send(JSON.stringify(data)))
      .catch(() => res.send(JSON.stringify(errorMessage.countryError)))
  })
  //covidApi
  .get('/covid/country/name/:countryName', (req, res) => {
    covidApi.getCountryByName(req.params.countryName)
      .then(data => res.send(JSON.stringify(data)))
      .catch(() => res.send(JSON.stringify(errorMessage.covidError)))
  })
  .get('/covid/country/code/:countryCode', (req, res) => {
    covidApi.getCountryByCode(req.params.countryCode)
      .then(data => res.send(JSON.stringify(data)))
      .catch(() => res.send(JSON.stringify(errorMessage.covidError)))
  })
  .get('/covid/country/search', (req, res) => {
    covidApi.getCountryBySearch(req.query.searchText)
      .then(data => res.send(JSON.stringify(data)))
      .catch(() => res.send(JSON.stringify(errorMessage.covidError)))
  })
  //weatherApi
  .get('/weather/city/:cityName', (req, res) => {
    weatherApi.getWeatherByCity(req.params.cityName)
      .then(data => res.send(JSON.stringify(data)))
      .catch(() => res.send(JSON.stringify(errorMessage.weatherError)))
  })
  .get('/weather/search', (req, res) => {
    weatherApi.getWeatherBySearch(req.query)
      .then(data => res.send(JSON.stringify(data)))
      .catch(() => res.send(JSON.stringify(errorMessage.weatherError)))
  })
  //twitterApi

  .get('*', (req, res) => {
    res.send(JSON.stringify(errorMessage.generalError));
  })

  const PORT=process.env.PORT||8000;
  app.listen(PORT,()=>{
    console.log(`app on port ${PORT}`)
  });