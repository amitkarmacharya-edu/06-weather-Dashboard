
// store the api key
const APPID = "e7cca708a4710838a2c48823212c8011";

// DAYS of the week
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// forecast data
var forecastData = [];
// recent search history
var recentSearch = [];
// current Weather
var currentWeather = {};
// current city name
var currentCity = "baltimore" // by default;


// check if storage is available
function storageAvailable() {
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

// get current Weather
function getWeatherData() {

    // request query string
    let queryString = `?q=${currentCity}&&APPID=${APPID}`;
    // query url
    let queryUrl = "http://api.openweathermap.org/data/2.5/weather" + queryString;
    // request url object for weather api endpoint
    let URL = {
      url: queryUrl,
      methood: "GET",
    };
    
    // asynchronus request for currentWeather
    $.ajax(URL).then(function (response) {

        // console.log(response);

      // save the date
      currentWeather["date"] = dateInString(response.dt);
      // save the longitude
      currentWeather["lon"] = response.coord.lon;
      // save the latitude
      currentWeather["lat"] = response.coord.lat;
      // save the city name
      currentWeather["cityName"] = response.name;
      // save the  temperature information
      currentWeather["temp"] = kelvinToFahrenheit(response.main.temp);
      // save the humidity
      currentWeather["humidity"] = response.main.humidity;
      // save the wind speed
      currentWeather["wind"] = response.wind.speed;
      // save the weather description
      currentWeather["description"] = response.weather.description;
      // save the weather icon
      currentWeather["icon"] = response.weather[0].icon;

      // query String for UVIndex
      queryString = `?units=imperial&lat=${currentWeather.lat}&lon=${currentWeather.lon}&appid=${APPID}`;
      // query Url for UVIndex
      queryUrl = "http://api.openweathermap.org/data/2.5/uvi" + queryString;
      // query object for UVIndex api endpoint
      URL["url"] = queryUrl;
  
      // asynchronus request for UVIndex
      $.ajax(URL).then(function (response) {

        // save the UVIndex value
        currentWeather['UVIndex'] = response.value;

        // since there was data for city name provided by the user, 
        // we can save the city name to the search histody
        saveToStorage();

        // get forecast data for the city
        getForecastData();

        // render the data
        populate();
      });
    });

}

// get forecast weather
function getForecastData() {

     // create a query string
  let queryString = `?q=${currentCity}&exclude=hourly&appid=${APPID}`;
  // create a query url
  let queryUrl = "http://api.openweathermap.org/data/2.5/forecast" + queryString;
  
  // create url object
  let URL = {
    url: queryUrl,
    method: 'GET'
  };

  // asynchoronus request
  $.ajax(URL).then(function(response) {
    
    let list = {};

    // for all the response
    for(let i = 0; i < response.list.length; i++) {

      // save the current list
      let item = response.list[i];

      // get the day of the week
      let day = new Date(item.dt*1000).getDay();

      // store the date
      let temp = {
        day: DAYS[day],
        date: dateInString(item.dt),
        icon: item.weather[0].icon,
        temp: kelvinToFahrenheit(item.main.temp),
        humidity: item.main.humidity
      };

      // check the day of the week and store data corroesponding to that in the same key as a list
      list.hasOwnProperty(DAYS[day]) ? list[DAYS[day]].push(temp) : list[DAYS[day]] = [temp];

      let keys = Object.keys(list);
      forecastData = [];
      // loop through all the keys
      for(let i = 0; i < keys.length; i++) {
        forecastData.push(list[keys[i]][0]);
      }
    }

    // display the data
    displayForecastData();
  });

}

// display the data on the page
function populate() {

    // display search history
    readFromStorage();
    let $recentSearchUL = $('.recent-search-list');
    $recentSearchUL.empty();
    for(let i = 0; i < recentSearch.length; i++) {
        let $li = $('<li>').addClass('list-group-item city');
        $li.text(recentSearch[i]);
        $recentSearchUL.append($li);
    }

    // display current weather
    $('.cw-cityName').text(currentWeather.cityName);
    $('.cw-date').text(currentWeather.date);
    $('.weather-icon').attr('src', `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`);
    $('.weather-description').text(currentWeather.description);
    $('.temperature').html(currentWeather.temp + " &deg;F");
    $('.windSpeed').text(currentWeather.wind + " mph");
    $('.humidity').text(currentWeather.humidity + " %");
    $('.uvIndex').text(currentWeather.UVIndex);

}

// display forecast
function displayForecastData(){
  // display forecast data
  $('.forecast').empty();
  for(let i = 0; i < forecastData.length; i++) {
      let day = forecastData[i];
      let cardTemplate = `<!-- col -->
                          <div class="col-md-3 m-1 card text-white mb-3" style="max-width: 18rem;">
                              <div class="card-header text-center bg-primary">
                                <span>${day.date}</span>
                                <span class="d-block">${day.day.toUpperCase()}</span>
                              </div>
                              <div class="card-body bg-info">
                                  <img class="" src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="icon">
                                  <p class="card-text mt-3">${day.temp} &deg;F</p>
                                  <p class="card-text">${day.humidity + " %"}</p>
                              </div>
                          </div>`;
      $('.forecast').append(cardTemplate);
  }
}

/**
 * helper function
 */

// get date string
function dateInString(date) {
    // convert to milisecon Epoch time
    date = date * 1000; 
    let dt = new Date(date); // Date(epoch seconds)
    return dt.getMonth()+1 + "/" + dt.getDate() + "/" + dt.getFullYear();
}

// kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return Math.ceil(1.8 * (kelvin - 273) + 32);
}

/**
 *  Event listener
 */
// add event listener for the form submit or click
$('.search-form').on("submit", function (event) {

    event.preventDefault();
    $searchInput = $("#searchInput");
    // check for empty string
    if ($searchInput.val() === "") {
      return;
    }
    currentCity = $searchInput.val();
    $searchInput.val("");
  
    // get  weather data
    getWeatherData();
  
  });

// event listener to the li elements, change the functionality to button
$('.recent-search-list').on('click',function(event){

    // this will capture ul so event.target will capture the element where user clicked
    // in this case it will return the li element
    $this = $(event.target);

    currentCity = $this.text();

    getWeatherData();

  });


// initialize the page
(function (){
  getWeatherData();
})();