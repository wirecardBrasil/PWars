(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedItens: [],
    previous: '',
    next: ''
  };
  var showResults = () => {
    var container = document.querySelector(".pwa-container");
    var content = '<div class="result-list">'
    app.selectedItens.forEach((e) => {
      content += generateCardForCharacter(e)
    })
    content += '</div>'
    container.innerHTML = content
  }

   var generateCardForCharacter = (char) => {
    var splits = char.url.split('/')
    var id = splits[splits.length-2]
    var gender = char.gender === 'male' ? 'masculino' : 'feminino'
    return `<div class="flip-container" >
      <div class="result-list__card demo-card-square mdl-card mdl-shadow--2dp flipper">
        <div class="front">
          <div class="mdl-card__title mdl-card--expand" style="background: url(images/bg/${id}.jpg)">
            <div class="mdl-card__title-container">
              <h2 class="mdl-card__title-text">${char.name}</h2>
            </div>
          </div>
        </div>
        <div class="back">
          <div class="mdl-card__supporting-text">
            <p> <span class="result-list__card-label"> Altura: </span> ${char.height} cm </p>
            <p> <span class="result-list__card-label"> Peso: </span> ${char.mass} kilos</p>
            <p> <span class="result-list__card-label"> Gênero: </span> ${gender} </p>
            <p> <span class="result-list__card-label"> Nascimento: </span> ${char.birth_year} </p>
          </div>
        </div>
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
        console.log(app.next)
        showResults()
        let flippers = document.querySelectorAll('.flip-container')
        Array.from(flippers).forEach(flip => {
          flip.addEventListener('click', function(event) {
            flippers.forEach((e) => {
              e.classList.remove('--opened');
            });
            this.classList.toggle('--opened');
          });
        });
      })
    }).catch((error) => {
      getFromCache()
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
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
