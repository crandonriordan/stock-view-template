
(function () {
  'use strict';

  const APIKEY = config.APIKEY;
  const EXAMPLEURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=${APIKEY}`;
  const TIMESERIES = "Time Series (Daily)";
  const OPEN_ID = "1. open"; // the key for the json data
  const CLOSE_ID = "4. close"; // the key for the json data

  // decided against using a class declaration
  // as I only need one object for this site specifically






  fetch(EXAMPLEURL)
  .then( function(response) {
    return response.json();
  })
  .then(function(json) {

    let stockData = json[TIMESERIES];
    let stockName = json["Meta Data"]["2. Symbol"];

    let MsftStock = {
      stockData: stockData,
      stockName: stockName,
      currentDateString: formatDate(getCurrentWeekday()),
      previousDateString: formatDate(getPreviousWeekday()),
    };

    console.log(MsftStock);

    populateStockData(MsftStock);
    createStockList(MsftStock);

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

  function getCurrentWeekday() {
    let currentDate = new Date();
    // ensure weekday if sat or sun
    if(currentDate.getDay() == 6) currentDate.setDate(currentDate.getDate() - 1);
    if(currentDate.getDay() == 0) currentDate.setDate(currentDate.getDate() - 2);

    return currentDate;
  }

  function getPreviousWeekday() {
    let previousDate = new Date(Date.now() - 864e5);
    let currentDate = new Date();

    if(currentDate.getDay() == 6) previousDate.setDate(previousDate.getDate() - 1);
    if(currentDate.getDay() == 0) previousDate.setDate(previousDate.getDate() - 2);
    if(currentDate.getDay() == 1) previousDate.setDate(previousDate.getDate() - 3);

    return previousDate;
  }


  // on weekends stockData will be undefined
  // on sat/sun we will make the currDate and prevDate thurs/friday
  // on monday we will make the currDate and prevDate friday/monday

  function populateStockData(stock) {
    let currData = stock.stockData[stock.currentDateString];
    let prevData = stock.stockData[stock.previousDateString];
    stock.price = parseFloat(currData[OPEN_ID]).toFixed(2);
    stock.change = parseFloat(currData[OPEN_ID] - prevData[CLOSE_ID]).toFixed(2);

    // % Decrease = Decrease ÷ Original Number × 100
    stock.changePercentage = parseFloat((currData[OPEN_ID]
      - prevData[CLOSE_ID]) / prevData[CLOSE_ID] * 100).toFixed(2);
    stock.previousClose = parseFloat(prevData[CLOSE_ID]).toFixed(2);
  }

  function createStockList(stock) {
    // this var will be used to set class name of stock percentage for styling purposes
    let percentageClassName = (stock.changePercentage < 0) ? 'stock--negative' : 'stock--positive';
    let changeClassName = (stock.change < 0) ? 'stock--negative' : 'stock--positive';

    let markup = `
        <li class="stock__name">${stock.stockName}</li>
        <li class="stock__price">${stock.price}</li>
        <li class="stock__change ${changeClassName}">${stock.change}</li>
        <li class="stock__percentage_change ${percentageClassName}">${stock.changePercentage}</li>
        <div class="stock_info hidden">
          <div>Open: <span>${stock.price}</span></div>
          <div>Prev. close: <span>${stock.previousClose}</span></div>
          <div>Change %: <span class="${percentageClassName}">${stock.changePercentage}</span></div>
          <div>Change: <span class="${changeClassName}">${stock.change}</span></div>
        </div>
    `;

    let stockList = document.createElement("ul");
    stockList.className = "stock";
    stockList.innerHTML = markup;
    stockList.onclick = triggerDropDownInformation;
    let article = document.getElementById("stock-container");
    article.appendChild(stockList);


  }





  // anonymous functions for event listeners
  let triggerDropDownInformation = function(event) {
    let stockInfoElement = this.childNodes[9];
    this.childNodes[9].classList.toggle("hidden");
    this.childNodes[9].classList.toggle("displayed");
  }
}());
