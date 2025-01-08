const main = document.querySelector('.main');
const search = document.querySelector('.search');
const searchInput = document.querySelector('.search__input');
const container = document.querySelector('.container');
const searchForm = document.querySelector('.search');

const searchMenu = document.createElement('ul');
const resultsDiv = document.createElement('div');
searchMenu.classList.add('search__menu');
resultsDiv.classList.add('results');
searchForm.appendChild(searchMenu);
container.appendChild(resultsDiv);


// Функция создания и отображения результатов поиска
function displaySearchResults(menuItems) {
    menuItems.map(el => {
        const item = document.createElement('li');
        item.classList.add('search__menu-item');
        item.setAttribute('data-name', el.name);
        item.setAttribute('data-owner', el.owner.login);
        item.setAttribute('data-stars', el.stargazers_count);
        item.textContent = el.name;
        searchMenu.appendChild(item);
    });
}

  // Функция для получения данных
async function getRequest(searchValue) {
    try {
        if (!searchValue.trim()) {    // Проверка на пустое поле поиска
            searchMenu.innerHTML = '';
            return
        }

    const response = await fetch(`https://api.github.com/search/repositories?q=${searchValue}`);
    const result = await response.json();
    console.log(result.items)

    searchMenu.innerHTML = '';     // Очистка предыдущих результатов

    if (!response.ok) {
      const message = `fetch error! status: ${response.status}`;
      throw new Error(message);
    }  

    displaySearchResults(result.items.slice(0, 5));  // Отображение результатов поиска

  } catch(error) {
    console.log(error);
  }
}

// Функция debounce
const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, debounceTime)
  }
};


// Cлушатель событя на отпускание клавиши
searchInput.addEventListener('keyup', debounce(function() {
  getRequest(searchInput.value);
}, 400));


// Функция для создания элемента с информацией о репозитории
function createResultItem(closestMenuItem) {
  let name = closestMenuItem.getAttribute('data-name');
  let owner = closestMenuItem.getAttribute('data-owner');
  let star = closestMenuItem.getAttribute('data-stars');

  let newInfo = `
  <p>Name: ${name}</p>
  <p>Owner: ${owner}</p>
  <p>Stars: ${star}</p>
`;

  const resultItem = document.createElement('div');
  resultItem.classList.add('results__item');
  resultItem.insertAdjacentHTML('beforeend', newInfo);
  return resultItem;
}


// Функция кнопки закрытия
function btnRemoveItem(event) {
  let currentItem = event.target.closest('.results__item');
  if(currentItem) {
      currentItem.remove();
}
}

  // Функция создания кнопки закрытия
function createCloseButton(resultItem) {
  const btn = document.createElement('button');
  btn.classList.add('btn__item-close');

  const img = document.createElement('img');
  img.src = 'img/close.svg';
  img.alt = 'close';

  btn.appendChild(img);
  btn.addEventListener('click', btnRemoveItem);
  return btn;
}


// Слушатель события при клике на меню
searchMenu.addEventListener('click', function(event) {
    let closestMenuItem = event.target.closest('.search__menu-item');
    if (closestMenuItem) {
      searchInput.value = '';
      searchMenu.innerHTML = '';
      
      const resultItem = createResultItem(closestMenuItem);
      const buttonClose = createCloseButton(resultItem)

      resultsDiv.appendChild(resultItem);
      resultItem.appendChild(buttonClose);
    }
  })