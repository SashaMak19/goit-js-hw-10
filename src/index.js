import { fetchCountries } from './fetchCountries';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refInput = document.querySelector('#search-box');
const refList = document.querySelector('.country-list');
const refDiv = document.querySelector('.country-info');

refInput.placeholder = 'Search by name..';
refInput.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  const inputValue = e.target.value.trim();

  getResponse(inputValue).catch(error => {
    if (inputValue === '') {
      refList.innerHTML = '';
      refDiv.innerHTML = '';

      e.target.placeholder = 'Search by name..';
    } else {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refList.innerHTML = '';
      refDiv.innerHTML = '';
    }
  });
}

function getResponse(nameCounrty) {
  return fetchCountries(nameCounrty)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(data => {
      forInterface(data);
    });
}

function forInterface(data) {
  if (data.length > 10) {
    refList.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (data.length >= 2 && data.length <= 10) {
    markupList(data);
  }

  if (data.length === 1) {
    markupCounrtyInfo(data);
  }
}

function markupList(arr) {
  const markup = arr
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" width='150px' height="auto" />
        <p>${country.name.common}</p>
      </li>`;
    })
    .join('');
  refDiv.innerHTML = '';
  refList.innerHTML = markup;
}

function markupCounrtyInfo(arr) {
  const markup = arr.map(country => {
    const valuesArrLanguages = Object.values(country.languages).join(', ');

    return `
      
        <h2 class="title-info">${country.name.common}</h2><img src="${country.flags.svg}" width="110px">
        <p>Capital: ${country.capital}</p>
        <p>Population: ${country.population}</p>
        <p>Languages: ${valuesArrLanguages}</p>
      `;
  });
  refList.innerHTML = '';
  refDiv.innerHTML = markup;
}
