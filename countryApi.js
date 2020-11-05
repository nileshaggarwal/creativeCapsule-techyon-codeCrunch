const fetch = require('node-fetch');

class CountryApi {
 constructor() {
  this.errorMessage = {
   status: 404,
   message: "Country not found"
  }
 }

 async getCountryByName(name, flag) {
  let urlResp = await fetch(`https://restcountries.eu/rest/v2/name/${name}`);
  let json = await urlResp.json();
  let returnData;

  json.map(country => {
   if (country.name.toLowerCase() === name.toLowerCase()) {
    returnData = {
     name: country.name,
     alpha2Code: country.alpha2Code,
     alpha3Code: country.alpha3Code,
     capital: country.capital,
     region: country.region,
     population: country.population,
     flag: country.flag,
     totalLanguages: country.languages.length,
     totalCurrencies: country.currencies.length,
     totalTimeZones: country.timezones.length
    }
   }
  })

  if (typeof returnData === "undefined")
   returnData = this.errorMessage;
  if (flag === "path")
   delete returnData.totalTimeZones;

  return returnData;
 }

 async getCountryByCode(code) {
  let urlResp = await fetch(`https://restcountries.eu/rest/v2/alpha/${code}`);
  let json = await urlResp.json();
  let returnData;

  if (json.status === 404 || json.status === 400)
   returnData = this.errorMessage;
  else {
   returnData = {
    name: json.name,
    alpha2Code: json.alpha2Code,
    alpha3Code: json.alpha3Code,
    capital: json.capital,
    region: json.region,
    population: json.population,
    flag: json.flag,
    totalLanguages: json.languages.length,
    totalCurrencies: json.currencies.length,
    totalTimeZones: json.timezones.length
   }
  }

  return returnData;
 }

 async getCountryByCapital(capital) {
  let urlResp = await fetch(`https://restcountries.eu/rest/v2/capital/${capital}`);
  let json = await urlResp.json();
  let returnData;

  if (json.status === 404 || json.status === 400)
   returnData = this.errorMessage;
  else {
   returnData = {
    name: json[0].name,
    capital: json[0].capital,
    population: json[0].population,
    flag: json[0].flag,
    totalLanguages: json[0].languages.length,
    totalCurrencies: json[0].currencies.length,
    totalTimeZones: json[0].timezones.length
   }
  }

  return returnData;
 }

 async getCountryBySearch(searchText) {
  let returnData;
  let re = /^\d+$/;

  if (re.test(searchText)) {
   let urlResp = await fetch(`https://restcountries.eu/rest/v2/callingcode/${searchText}`);
   let json = await urlResp.json();
   returnData = [];
   returnData.push(json.map(country => {
    return {
     name: country.name,
     capital: country.capital,
     population: country.population,
     flag: country.flag,
     totalLanguages: country.languages.length,
     totalCurrencies: country.currencies.length,
     totalTimeZones: country.timezones.length
    };
   }))
  } else if ((await this.getCountryByCode(searchText)).status !== 404) {
   returnData = await this.getCountryByCode(searchText);
   delete returnData.alpha2Code;
   delete returnData.alpha3Code;
   delete returnData.region;
  } else if ((await this.getCountryByCapital(searchText)).status !== 404) {
   returnData = await this.getCountryByCapital(searchText);
  } else if ((await this.getCountryByName(searchText)).status !== 404) {
   returnData = await this.getCountryByName(searchText);
   delete returnData.alpha2Code;
   delete returnData.alpha3Code;
   delete returnData.region;
  } else
   returnData = this.errorMessage;

  return returnData;
 }
}

module.exports = new CountryApi();