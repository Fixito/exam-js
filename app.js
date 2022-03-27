import { villesV2 } from './cities.js';
import { infoBruxelles } from './cities.js';

const section = document.querySelector('.card-section');
const modal = document.querySelector('.modal');
const { temp, precip, humidite, vent, icon } = infoBruxelles;

const progress = (bar, percentage) => {
  bar.style.width = '0';
  setTimeout(() => {
    bar.style.width = percentage;
  }, 500);
};

let cards = villesV2.map((city) => {
  const { name, desc, url } = city;
  return `
      <article class="card">
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
  card.addEventListener('click', (e) => {
    modal.classList.add('show-modal');
    modal.innerHTML = `
    <div class="modal-content">
          <i class="fa-solid fa-xmark"></i>
          <div class="left">
            <h5 class="left__title">Bruxelles</h5>
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
                ${vent} km/h
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
                <div class="progress" id="humidityBar" style="width: ${humidite}"><span>${humidite}</span></div>
              </div>
            </div>
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

    btnClose.addEventListener('click', (e) => {
      modal.classList.remove('show-modal');
    });

    precipitationIcon.addEventListener('click', () => {
      precipBar.style.width = '0';
      progress(precipBar, precip);
    });

    humidityIcon.addEventListener('click', () => {
      humidityBar.style.width = '0';
      progress(humidityBar, humidite);
    });
  });
});
