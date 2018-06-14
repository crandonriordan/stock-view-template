let el = document.querySelectorAll(".stock");

// anonymous functions for event listeners

let triggerDropDownInformation = function(event) {
  let stockInfoElement = this.childNodes[9];
  this.childNodes[9].classList.toggle("hidden");
  this.childNodes[9].classList.toggle("displayed");
}


// don't iterate through the first stock as it's the header

for(let i = 1; i < el.length; i++) {
  el[i].addEventListener("click", triggerDropDownInformation)
}

// https://iextrading.com/api-exhibit-a/
const BASEURL = "https://api.iextrading.com/1.0";
const APIKEY = config.APIKEY;
