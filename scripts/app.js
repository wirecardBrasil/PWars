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
    
  var showSnackbar = () => {
    var snackbarContainer = document.querySelector('#demo-snackbar-example');
    var data = {
      message: 'You are offline',
      timeout: 3000
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }

   window.addEventListener('offline', () => {
    showSnackbar()
    console.log('deu ruim')
  });

   /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  // document.getElementById('butAddCancel').addEventListener('click', function() {
  //   // Close the add new city dialog
  //   app.toggleAddDialog(false);
  // });


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
