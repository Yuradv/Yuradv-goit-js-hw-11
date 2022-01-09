import Notiflix from 'notiflix';
import NewsApiService from './new-api';
import counterCard from './templates/counterCard';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import './css/styles.css';

const refs = {
  searchFrom: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const newsApiService = new NewsApiService();

refs.searchFrom.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', fetchPictures);

function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (newsApiService.query === '') {
    return Notiflix.Notify.warning('Please, fill the main field');
  }

  newsApiService.resetPage();
  clearPhotosGallery();
  fetchPictures();
}

function fetchPictures() {
  refs.loadMoreBtn.classList.add(`is-hidden`);
  newsApiService.fetchGalleryCards().then(hits => {
    appendPicsMarkup(hits);
    refs.loadMoreBtn.classList.remove(`is-hidden`);
  });
}

function appendPicsMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', counterCard(data.hits));
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

  const gallery = new SimpleLightbox('.gallery a', {
    close: true,
    closeText: '×',
    preloading: true,
    enableKeyboard: true,
    docClose: true,
    captions: false,
  });
  gallery.refresh();

  if (data.hits.length < 40 && data.hits.length > 0) {
    refs.loadMoreBtn.classList.add(`is-hidden`);
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }

  if (data.hits.length === 0) {
    refs.loadMoreBtn.classList.add(`is-hidden`);
    return Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

function clearPhotosGallery() {
  refs.gallery.innerHTML = '';
}
