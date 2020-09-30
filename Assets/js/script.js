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
    recentSearch = JSON.parse(localStorage.getItem("searchHistory"));
  } else {
    // debug
    console.log("There is data inside local storage");
    recentSearch = [];
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

// display the data on the page
function populate() {

    // display search history
    readFromStorage();
    $recentSearchUL.empty();
    for(let i = 0; i < recentSearch.length; i++) {
        let $li = $('<li>').addClass('list-group-item list-city');
        $recentSearchUL.append($li);
    }

    // display current weather
    getWeatherData();
    $('.cw-cityName').text(currentWeather.cityName);
    $('.cw-date').text(currentWeather.date);
    $('.weather-icon').attr('src', `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`);
    $('.weather-description').text(currentWeather.description);
    $('.temperature').text(currentWeather.temp+" &deg;F");
    $('.windSpeed').text(currentWeather.wind + " mph");
    $('.humidity').text(currentWeather.humidity + " %");

    // display forecast data
    getForecastData();
    $('.forecast').empty();
    for(let i = 0; i < forecastData.length; i++) {

        let day = forecastData[i];
        let cardTemplate = `<!-- col -->
                            <div class="col-md m-1 card text-white bg-info mb-3" style="max-width: 18rem;">
                                <div class="card-header text-center">${day.date}</div>
                                <div class="card-body">
                                    <img class="d-block text-center" src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="icon">
                                    <p class="card-text mt-3">${day.temp + " &deg;F"}</p>
                                    <p class="card-text">${day.humidity + " %"}</p>
                                </div>
                            </div>`;
        $('.forecast').append(cardTemplate);
    }



}