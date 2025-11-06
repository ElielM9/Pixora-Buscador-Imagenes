// Constantes
const RESULTS_CONTAINER_ID = document.querySelector(`#results-container`);
const SEARCHER_FORM_ID = document.querySelector(`#searcher-form`);
const REGISTERS_PER_PAGE = 40;

//  Variables
let totalPages;
let iterator;
let currentPage = 1;

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener(`DOMContentLoaded`, startApp);

function startApp() {
  // Funcion para el formulario de busqueda
  handleSearcherForm();
}

function handleSearcherForm() {
  SEARCHER_FORM_ID.addEventListener(`submit`, validateForm);
}

function validateForm(event) {
  event.preventDefault();

  const searchTerm = document.querySelector(`#search-term`).value;
  if (searchTerm === ``) {
    showAlert(`El término de búsqueda está vacío`);

    return;
  }

  // Si el término de búsqueda es válido, buscar las imágenes
  searchImages();
}

function showAlert(message) {
  // Validar que la alerta no exista
  const existingAlert = document.querySelector(`.alert`);

  if (!existingAlert) {
    const alert = document.createElement(`p`);
    alert.classList.add(`alert`, `alert--error`);
    alert.innerHTML = `<strong>Error:</strong> ${message}`;

    SEARCHER_FORM_ID.parentElement.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function searchImages() {
  const term = document.querySelector(`#search-term`).value;
  const API_KEY = `53095941-15c0123b5eb4b92a48a772f33`;
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${term}&per_page=${REGISTERS_PER_PAGE}&page=${currentPage}`;

  fetch(URL)
    .then((response) => response.json())
    .then((result) => {
      let results = result.hits;
      totalPages = calculatePages(result.totalHits);

      displayImages(results);
    });
}

// Generador que registra los elementos de acuerdo a la cantidad de páginas
function* createPaginator(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function calculatePages(totalRecords) {
  return parseInt(Math.ceil(totalRecords / REGISTERS_PER_PAGE));
}

function displayImages(images) {
  // Limpiar resultados anteriores
  clearPreviousResults(RESULTS_CONTAINER_ID);

  // Iterar sobre las imágenes y mostrarlas en el DOM
  images.forEach((image) => {
    const { likes, views, largeImageURL, pageURL } = image;

    const imgItem = document.createElement(`div`);
    imgItem.classList.add(`gallery-item`);
    imgItem.innerHTML = `
      <img src="${largeImageURL}" class="gallery-item__img" />
      <div class="gallery-item__info">
        <p class="gallery-item__likes">👍 ${likes}</p>
        <p class="gallery-item__views">👁️ ${views}</p>
        <a
           href="${pageURL}"
           target="_blank"
           rel="noopener noreferrer"
           class="gallery-item__btn">
            Ver imágen
        </a>
      </div>
    `;

    RESULTS_CONTAINER_ID.appendChild(imgItem);
  });

  // Imprimir el paginador
  printPaginator();
}

function printPaginator() {
  iterator = createPaginator(totalPages);

  const paginationContainer = document.querySelector(`#pagination-container`);

  clearPreviousResults(paginationContainer);

  //
  while (true) {
    const { value, done } = iterator.next();

    if (done) return;

    // Generar un boton por elemento en el generador
    const pageButton = document.createElement(`a`);
    pageButton.href = `#`;
    pageButton.dataset.page = value;
    pageButton.textContent = value;
    pageButton.classList.add(`pagination__btn`);

    pageButton.onclick = () => {
      currentPage = value;
      searchImages();
    };

    paginationContainer.appendChild(pageButton);
  }
}

// Utilidades

// Función para limpiar resultados anteriores del DOM
function clearPreviousResults(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
