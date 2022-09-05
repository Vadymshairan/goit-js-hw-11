import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImg } from './fetchImg';
import { galleryMarkup } from './galleryMarkup';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  // captions: true,
  // captionType: 'attr',
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSearchBtnSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.loadMoreBtn.style.display = 'none';

let searchQuery = '';
let page = 1;
const perPage = 40;

function onSearchBtnSubmit(e) {
  e.preventDefault();

  page = 1;
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.style.display = 'none';
  searchQuery = e.currentTarget.searchQuery.value.trim();

  fetchImg(searchQuery, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoMatch();
      } else {
        alertSucces(data);
        refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup(data.hits));
        lightbox.refresh();
        if (data.totalHits > perPage) {
          refs.loadMoreBtn.style.display = 'block';
          console.log(refs.loadMoreBtn.style);
        }
      }
    })
    .catch(e => console.log(e));
}

function onLoadMoreBtnClick() {
  page += 1;
  fetchImg(searchQuery, page, perPage)
    .then(({ data }) => {
      refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup(data.hits));
      lightbox.refresh();
      if (page > Number(data.totalHits / perPage)) {
        refs.loadMoreBtn.style.display = 'none';
        alertEnd();
      }
    })
    .catch(e => console.log(e));
}

function alertNoMatch() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      position: 'center-center',
    }
  );
}

function alertSucces(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`, {
    position: 'center-center',
  });
}
function alertEnd() {
  Notify.info(`"We're sorry, but you've reached the end of search results."`, {
    position: 'center-center',
  });
}
