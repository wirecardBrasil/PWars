// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedItens: [],
    previous: '',
    next: ''
    // spinner: document.querySelector('.loader'),
    // cardTemplate: document.querySelector('.cardTemplate'),
    // container: document.querySelector('.main'),
    // addDialog: document.querySelector('.dialog-container')
  };
  var showResults = () => {
    var container = document.querySelector(".pwa-container");
    var content = '<div class="result-list">'
    app.selectedItens.forEach((e) => {
      content += generateCardForCharacter(e)
    })
    content += '</div>'
    container.innerHTML = content
    // window.localStorage.lastResults = JSON.stringify(app.selectedItens)
  }


  var generateCardForCharacter = (char) => {
    return `<div class="result-list__card demo-card-square mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title mdl-card--expand">
        <h2 class="mdl-card__title-text">${char.name}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        <p> <span class="result-list__card-label"> Altura: </span> ${char.height} cm </p>
        <p> <span class="result-list__card-label"> Peso: </span> ${char.mass} kilos</p>
        <p> <span class="result-list__card-label"> Gênero: </span> ${char.gender} </p>
        <p> <span class="result-list__card-label"> Nascimento: </span> ${char.birth_year} </p>
      </div>
    </div>`
  }
  fetch('https://swapi.co/api/people/?format=json')
    .then(function(response) {
      let json = response.json()
      .then(json => {
        app.selectedItens = json.results
        app.previous = json.previous
        app.next = json.next
        showResults()
      })
    }).catch((error) => {
      console.log(error)
      getFromCache()
      // showResults()
    })





  var getFromCache = () => {
    caches.match('https://swapi.co/api/people/?format=json')
    .then((res) => res.json())
    .then((json) => {
      console.log(json.results)
      app.selectedItens = json.results
      showResults()
    })
  }
    
  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  // document.getElementById('butAddCancel').addEventListener('click', function() {
  //   // Close the add new city dialog
  //   app.toggleAddDialog(false);
  // });


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  // app.getForecast = function(key, label) {
  //   var statement = 'select * from weather.forecast where woeid=' + key;
  //   var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
  //       statement;
  //   // TODO add cache logic here
  //   if ('caches' in window) {
  //     /*
  //      * Check if the service worker has already cached this city's weather
  //      * data. If the service worker has the data, then display the cached
  //      * data while the app fetches the latest data.
  //      */
  //     caches.match(url).then(function(response) {
  //       if (response) {
  //         response.json().then(function updateFromCache(json) {
  //           var results = json.query.results;
  //           results.key = key;
  //           results.label = label;
  //           results.created = json.query.created;
  //           app.updateForecastCard(results);
  //         });
  //       }
  //     });
  //   }
  //   // Fetch the latest data.
  //   var request = new XMLHttpRequest();
  //   request.onreadystatechange = function() {
  //     if (request.readyState === XMLHttpRequest.DONE) {
  //       if (request.status === 200) {
  //         var response = JSON.parse(request.response);
  //         var results = response.query.results;
  //         results.key = key;
  //         results.label = label;
  //         results.created = response.query.created;
  //         app.updateForecastCard(results);
  //       }
  //     } else {
  //       // Return the initial weather forecast since no data is available.
  //       app.updateForecastCard(initialWeatherForecast);
  //     }
  //   };
  //   request.open('GET', url);
  //   request.send();
  // };

  // // Iterate all of the cards and attempt to get the latest forecast data
  // app.updateForecasts = function() {
  //   var keys = Object.keys(app.visibleCards);
  //   keys.forEach(function(key) {
  //     app.getForecast(key);
  //   });
  // };

  // // TODO add saveSelectedCities function here
  // // Save list of cities to localStorage.
  // app.saveSelectedCities = function() {
  //   var selectedCities = JSON.stringify(app.selectedCities);
  //   localStorage.selectedCities = selectedCities;
  // };

  /*
   * Fake weather data that is presented when the user first uses the app,
   * or when the user has not saved any cities. See startup code for more
   * discussion.
   */
  var initialWeatherForecast = {
    key: '2459115',
    label: 'New York, NY',
    created: '2016-07-22T01:00:00Z',
    channel: {
      astronomy: {
        sunrise: "5:43 am",
        sunset: "8:21 pm"
      },
      item: {
        condition: {
          text: "Windy",
          date: "Thu, 21 Jul 2016 09:00 PM EDT",
          temp: 56,
          code: 24
        },
        forecast: [
          {code: 44, high: 86, low: 70},
          {code: 44, high: 94, low: 73},
          {code: 4, high: 95, low: 78},
          {code: 24, high: 75, low: 89},
          {code: 24, high: 89, low: 77},
          {code: 44, high: 92, low: 79},
          {code: 44, high: 89, low: 77}
        ]
      },
      atmosphere: {
        humidity: 56
      },
      wind: {
        speed: 25,
        direction: 195
      }
    }
  };
  // TODO uncomment line below to test app with fake data
  // app.updateForecastCard(initialWeatherForecast);

  /************************************************************************
   *
   * Code required to start the app
   *
   * NOTE: To simplify this codelab, we've used localStorage.
   *   localStorage is a synchronous API and has serious performance
   *   implications. It should not be used in production applications!
   *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
   *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
   ************************************************************************/

  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
