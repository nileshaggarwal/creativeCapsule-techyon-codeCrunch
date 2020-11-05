class ErrorMessages {
  constructor() {
      this.countryError = {
              status: 404,
              message: "Country not found"
          },
          this.covidError = {
              status: 404,
              message: "No records found"
          },
          this.weatherError = {
              status: 404,
              message: "Weather data not found"
          },
          this.generalError = {
              message: "Not Found"
          }
  }
}

module.exports = new ErrorMessages();