import { villesV2 } from './cities.js';
// import { infoBruxelles } from './cities.js';

const section = document.querySelector('.card-section');
const modal = document.querySelector('.modal-overlay');

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

cards.forEach((card) => {
  card.addEventListener('click', async (e) => {
    const city =
      e.currentTarget.firstElementChild.nextElementSibling.firstElementChild
        .textContent;

    const {
      name,
      wind: { speed },
      main: { humidity, temp, temp_min, temp_max },
      rain
    } = await getData(city);

    modal.classList.add('open-modal');

    const btnClose = document.querySelector('.fa-xmark');
    const leftTitle = document.querySelector('.left__title');
    const precipitationIcon = document.querySelector('#precip');
    const precipBar = document.querySelector('#precipBar');
    const humidityIcon = document.querySelector('#humidity');
    const humidityBar = document.querySelector('#humidityBar');
    const temperature = document.querySelector('.temp');
    const wind = document.querySelector('.wind');
    const ctx = document.getElementById('myChart').getContext('2d');
    let precip = 0;

    if (rain) {
      precip = rain['1h'];
    }

    let chartStatus = Chart.getChart('myChart');
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

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

    leftTitle.textContent = name;

    precipBar.style.width = precip;
    humidityBar.style.width = `${humidity}%`;

    precipBar.innerHTML = `<span>${precip} mm</span>`;
    humidityBar.innerHTML = `<span>${humidity}%</span>`;

    temperature.textContent = `${temp}°C`;
    wind.textContent = `${(speed * 3.6).toFixed(2)} km/h`;

    // precipValue.textContent = precip;
    // humidityValue.textContent = humidite;

    btnClose.addEventListener('click', () => {
      modal.classList.remove('open-modal');
      myChart.destroy();
    });

    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('open-modal')) {
        modal.classList.remove('open-modal');
        myChart.destroy();
      }
    });

    precipitationIcon.addEventListener('click', () => {
      precipBar.style.width = '0';
      progress(precipBar, precip);
    });

    humidityIcon.addEventListener('click', () => {
      humidityBar.style.width = '0';
      progress(humidityBar, `${humidity}%`);
    });
  });
});
