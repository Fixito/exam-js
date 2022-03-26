import { villesV2 } from './cities.js';

const section = document.querySelector('.card-section');

const cards = villesV2
  .map((city) => {
    const { name, desc, url } = city;
    return `
      <article class="card">
        <img src="./images/${url}" alt="${name}" class="img" />
        <div class="card-info title">
          <h4 class="card-title">${name}</h4>
          <h5 class="card-capital">${desc}</h5>
        </div>
      </article>`;
  })
  .join(' ');

section.innerHTML = cards;
