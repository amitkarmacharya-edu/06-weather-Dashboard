// container ul for recent search
$recentSearchUL = $('.recent-search-list');

// store the api key
const APPID = "e7cca708a4710838a2c48823212c8011";
// forecast data
var forecastData = [];
// recent search history
var recentSearch = [];
// current Weather
var currentWeather = {};
// current city name
var currentCity = "baltimore" // by default;



// check if storage is available
function storageAvailalbe() {
  var storage;
  try {
    storage = window.localStorage; // window.localStorage
    var x = "__storage_test__"; //
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

// read from storage
function readFromStorage() {
  // check for local storage
  if (!storageAvailable("localStorage")) {
    // Too bad, no localStorage for us
    return;
  }
  
  // check if there is saved data
  if (localStorage.getItem("searchHistory")) {
    // parse the data into javscript object then return it
    forecastData = JSON.parse(localStorage.getItem("searchHistory"));
  } else {
    // debug
    console.log("There is data inside local storage");
    forecastData = [];
  }

}

// save city Name to storage
function saveToStorage() {

// check for local storage
if (!storageAvailable("localStorage")) {
    // If storage is disabled/not supported
    console.log("storage not supported");
    return;
  }

  // get the localStorage object from window object
  let localStorage = window.localStorage;

  // check if there is previously saved data
  if (localStorage.getItem("searchHistory")) {

    let search = JSON.parse(localStorage.getItem("searchHistory"));
    
    if(search.includes(currentCity)){
        // data already present 
        console.log("Data already present");
    } else {
        // save new data
        search.unshift(currentCity);
    }
    // save the updated data inside localStorage
    localStorage.setItem("searchHistory", JSON.stringify(search));

  } else {
    // when there is no previously saved data
    localStorage.setItem("searchHistory", JSON.stringify(currentCity));
  }
}

// get curret Weather
function getWeatherData() {

}

// get

// display the data on the page
function populate() {

    // display search history
    readFromStorage();
    $recentSearchUL.empty();
    for(let i = 0; i < forecastData.length; i++) {
        let $li = $('<li>').addClass('list-group-item list-city');
        $recentSearchUL.append($li);
    }

}