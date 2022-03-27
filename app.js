import { villesV2 } from './cities.js';
import { infoBruxelles } from './cities.js';

const section = document.querySelector('.card-section');
const modal = document.querySelector('.modal');
const { precip, icon } = infoBruxelles;

const progress = (bar, percentage) => {
  bar.style.width = '0';
  setTimeout(() => {
    bar.style.width = percentage;
  }, 500);
};

const getData = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=349b948b344f9bb3790f9dfd015f1d50&units=metric&lang=fr`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

let cards = villesV2.map((city) => {
  const { id, name, desc, url } = city;
  return `
      <article class="card rotate-${id % 2 ? 'left' : 'right'}">
        <img src="./images/${url}" alt="${name}" class="img" />
        <div class="card-info title">
          <h4 class="card-title">${name}</h4>
          <h5 class="card-capital">${desc}</h5>
        </div>
      </article>`;
});

section.innerHTML = cards.join(' ');

cards = document.querySelectorAll('.card');
cards = [...cards];

cards.forEach((card) => {
  card.addEventListener('click', async (e) => {
    const city =
      e.currentTarget.firstElementChild.nextElementSibling.firstElementChild
        .textContent;
    const {
      name,
      wind: { speed },
      main: { humidity, temp, temp_min, temp_max }
    } = await getData(city);
    modal.classList.add('show-modal');
    modal.innerHTML = `
    <div class="modal-content">
          <i class="fa-solid fa-xmark"></i>
          <div class="left">
            <h5 class="left__title">${name}</h5>
            <div class="left__info">
              <span
                >${temp}°C
                <img
                  src="${icon}"
                  alt="vent"
                  class="left__info__logo"
                />
              </span>
              <span>
                ${speed} km/h
                <img
                  src="./images/wind.png"
                  alt="vent"
                  class="left__info__logo"
                />
              </span>
            </div>
            <div class="left__info__bar">
              <img
                src="./images/precipitation.png"
                alt="précipitation"
                class="modal-logo"
                id="precip"
              />
              <div class="bar">
                <div class="progress" id="precipBar" style="width: ${precip}">
                  <span>${precip}</span>
                </div>
              </div>
            </div>
            <div class="left__info__bar">
              <img
                src="./images/humidity.png"
                alt="précipitation"
                class="modal-logo"
                id="humidity"
              />
              <div class="bar">
                <div class="progress" id="humidityBar" style="width: ${humidity}%"><span>${humidity}%</span></div>
              </div>
              </div>
              <canvas id="myChart" width="500" height="250"></canvas>
          </div>
          <div class="right">
            <div class="stamp"></div>
          </div>
        </div>
    `;

    const btnClose = document.querySelector('.fa-xmark');
    const precipitationIcon = document.querySelector('#precip');
    const precipBar = document.querySelector('#precipBar');
    const humidityIcon = document.querySelector('#humidity');
    const humidityBar = document.querySelector('#humidityBar');
    const ctx = document.getElementById('myChart').getContext('2d');

    btnClose.addEventListener('click', () => {
      modal.classList.remove('show-modal');
    });

    precipitationIcon.addEventListener('click', () => {
      precipBar.style.width = '0';
      progress(precipBar, precip);
    });

    humidityIcon.addEventListener('click', () => {
      humidityBar.style.width = '0';
      progress(humidityBar, `${humidity}%`);
    });

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Today'],
        datasets: [
          {
            label: 'Température minimale',
            data: [temp_min],
            borderColor: 'blue'
          },
          {
            label: 'Température maximale',
            data: [temp_max],
            borderColor: 'red'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
});
