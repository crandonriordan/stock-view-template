// https://iextrading.com/api-exhibit-a/
const BASEURL = "https://api.iextrading.com/1.0";
const APIKEY = config.APIKEY;
const EXAMPLEURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=${APIKEY}`;
const TIMESERIES = "Time Series (Daily)";
const OPEN_ID = "1. open"; // the key for the json data
const CLOSE_ID = "4. close"; // the key for the json data



fetch(EXAMPLEURL)
.then( function(response) {
  return response.json();
})
.then(function(json) {
  let stockData = json[TIMESERIES];
  let stockName = json["Meta Data"]["2. Symbol"];
  let yesterdayDate = new Date(Date.now() - 864e5) // 846e5 ----> 24*60*60*1000
  let currentDate = formatDate();
  let previousDate = formatDate(yesterdayDate);

  createStockList(stockName, stockData, currentDate, previousDate);

})
.catch(function(error) {
  console.log(error);
})

// helper functions

function formatDate(date = new Date()) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function createStockList(stockName, stockData, currentDate, previousDate) {
  let currData = stockData[currentDate];
  let prevData = stockData[previousDate];
  let price = currData[OPEN_ID];
  let change = currData[OPEN_ID] - prevData[CLOSE_ID];
  // % Decrease = Decrease ÷ Original Number × 100
  let changePercentage = (currData[OPEN_ID]
    - prevData[CLOSE_ID]) / prevData[CLOSE_ID] * 100;
  let previousClose = prevData[CLOSE_ID];

  let markup = `
      <li class="stock__name">${stockName}</li>
      <li class="stock__price">${price}</li>
      <li class="stock__change stock--positive">${change}</li>
      <li class="stock__percentage_change stock--positive">${changePercentage}</li>
      <div class="stock_info hidden">
        <div>Open: <span>${price}</span></div>
        <div>Prev. close: <span>${previousClose}</span></div>
        <div>Change %: <span>${changePercentage}</span></div>
        <div>Change: <span>${change}</span></div>
      </div>
  `;
  let stockList = document.createElement("ul");
  stockList.className = "stock";
  stockList.innerHTML = markup;
  let article = document.getElementById("stock-container");
  article.appendChild(stockList);


}





// let el = document.querySelectorAll(".stock");
//
// // anonymous functions for event listeners
//
// let triggerDropDownInformation = function(event) {
//   let stockInfoElement = this.childNodes[9];
//   this.childNodes[9].classList.toggle("hidden");
//   this.childNodes[9].classList.toggle("displayed");
// }
//
//
// // don't iterate through the first stock as it's the header
//
// for(let i = 1; i < el.length; i++) {
//   el[i].addEventListener("click", triggerDropDownInformation)
// }
