'use strict';

(function () {
  var sortingContainerNode = document.querySelector('.img-filters ');
  var sortingButtons = sortingContainerNode.querySelectorAll('.img-filters__button');
  var picturesBlock = document.querySelector('.pictures');
  var DEBOUNCE_INTERVAL = 500;
  var xhrPhotos;
  var lastTimeout;

  // Удаляет все текущие миниатюры перед отрисовкой отсортированных миниатюр
  var removeOldPhotos = function () {
    var oldPhotos = picturesBlock.querySelectorAll('.picture__link');
    if (oldPhotos !== null) {
      [].forEach.call(oldPhotos, function (element) {
        picturesBlock.removeChild(element);
      });
    }
  };

  // Подставляет данные из массива объектов в фрагменты и встраивает их на страницу
  var renderPhotoCards = function (arr) {
    removeOldPhotos();
    var photoTemplateNode = document.querySelector('#picture').content.querySelector('.picture__link');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      var photoElement = photoTemplateNode.cloneNode(true);
      photoElement.querySelector('.picture__img').src = arr[i].url;
      photoElement.querySelector('.picture__stat--comments').textContent = arr[i].comments.length - 1;
      photoElement.querySelector('.picture__stat--likes').textContent = arr[i].likes;
      fragment.appendChild(photoElement);
    }
    document.querySelector('.pictures').appendChild(fragment);
  };

  // Фильтрует миниатюры по клику на кнопку фильтра
  var onSortButtonClick = function (evt) {
    var activeElement = evt.target;
    sortingContainerNode.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    activeElement.classList.add('img-filters__button--active');
    // Создаем копию массива для сортировки
    var photosCopy = xhrPhotos.slice();
    switch (activeElement.id) {
      case 'filter-popular':
        photosCopy = photosCopy.sort(function (first, second) {
          return second.likes - first.likes;
        });
        break;

      case 'filter-discussed':
        photosCopy = photosCopy.sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
        break;

      case 'filter-random':
        photosCopy = window.util.getShuffledArray(photosCopy);
        break;
    }
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      renderPhotoCards(photosCopy);
    }, DEBOUNCE_INTERVAL);
  };

  /*
Коллбек при удачной загрузке данных через XHR
отрисовывает все миниатюры фотографий, панель сортировки
и показывает сообщение об успешной загрузке
*/
  var onDataGetSuccess = function (data) {
    xhrPhotos = data;
    window.gallery.allPhotosArr = xhrPhotos;

    window.formValidation.displayXhrStatus('Данные загружены успешно');
    renderPhotoCards(xhrPhotos);
    sortingContainerNode.classList.remove('img-filters--inactive');
    [].forEach.call(sortingButtons, function (button) {
      button.addEventListener('click', onSortButtonClick);
    });
  };

  window.backend.getRequest(onDataGetSuccess, window.formValidation.displayXhrStatus);
  window.gallery = {};
})();

