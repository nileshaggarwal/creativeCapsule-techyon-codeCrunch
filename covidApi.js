const fetch = require('node-fetch'),
 https = require('https');

const httpsAgent = new https.Agent({
 rejectUnauthorized: false,
});

class CovidApi {
 constructor() {
  this.errorMessage = {
   status: 404,
   message: "No records found"
  }
 }

 async getCountryByName(name) {
  let urlResp = await fetch(`https://covid19-api.com/country?name=${name}&format=json`, {
   method: 'GET',
   agent: httpsAgent
  });
  let json = await urlResp.json();
  let returnData;

  if (json.length === 0)
   returnData = this.errorMessage;
  else {
   returnData = {
    country: json[0].country,
    confirmed: json[0].confirmed,
    recovered: json[0].recovered,
    critical: json[0].critical,
    deaths: json[0].deaths
   }
  }

  return returnData;
 }

 async getCountryByCode(code) {
  let urlResp = await fetch(`https://covid19-api.com/country/code?code=${code}&format=json`, {
   method: 'GET',
   agent: httpsAgent
  });
  let json = await urlResp.json();
  let returnData;

  if (json.length === 0)
   returnData = this.errorMessage;
  else {
   returnData = {
    country: json[0].country,
    confirmed: json[0].confirmed,
    recovered: json[0].recovered,
    critical: json[0].critical,
    deaths: json[0].deaths
   }
  }

  return returnData;
 }

 async getCountryBySearch(searchText) {
  let returnData;

  if ((await this.getCountryByCode(searchText)).status !== 404)
   returnData = await this.getCountryByCode(searchText);
  else if ((await this.getCountryByName(searchText)).status !== 404)
   returnData = await this.getCountryByName(searchText);
  else
   returnData = this.errorMessage;

  return returnData;
 }
}

module.exports = new CovidApi();