'use strict';

(function () {
  var bigPictureNode = document.querySelector('.big-picture');
  var bigPictureCloseNode = bigPictureNode.querySelector('.big-picture__cancel');
  var socialCommentsListNode = bigPictureNode.querySelector('.social__comments');
  var picturesListNode = document.querySelector('.pictures');

  var showBigPictureWithData = function (arrElem) {
    bigPictureNode.querySelector('.social__caption').textContent = arrElem.comments[0];
    bigPictureNode.querySelector('.big-picture__img img').src = arrElem.url;
    bigPictureNode.querySelector('.likes-count').textContent = arrElem.likes;
    bigPictureNode.querySelector('.comments-count').textContent = arrElem.comments.length;

    var fragment = document.createDocumentFragment();

    arrElem.comments.forEach(function (el) {
      var commentCloneNode = document.querySelector('.social__comment').cloneNode();
      var commentAvatarCloneNode = document.querySelector('.social__picture').cloneNode(true);
      var newTextNode = document.createTextNode(el);
      // Первый коммент далее используется как шаблон. Удаляем его атрибут style со св-вом display='none'
      commentCloneNode.style = null;

      commentAvatarCloneNode.src = 'img/avatar-' + window.util.getRandomNumber(1, 6) + '.svg';
      commentCloneNode.appendChild(commentAvatarCloneNode);
      commentCloneNode.appendChild(newTextNode);
      fragment.appendChild(commentCloneNode);
    });

    // Удаляет из разметки уже существующие комментарии
    while (socialCommentsListNode.firstChild) {
      socialCommentsListNode.removeChild(socialCommentsListNode.firstChild);
    }
    // И добавляет новые
    socialCommentsListNode.appendChild(fragment);
    // Первый элемент массива comments используется как social__caption, потому прячем его из socialCommentsListNode
    socialCommentsListNode.firstChild.style.display = 'none';
    // Скрывает ноды с количеством комментариев и спиннером
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
    bigPictureNode.classList.remove('hidden');
  };
  var onPictureMiniatureEvent = function (evt, isKeydownDown) {
    window.gallery.allPhotosArr.forEach(function (el) {
      if (isKeydownDown) {
        if (evt.target.querySelector('img').getAttribute('src') === el.url) {
          showBigPictureWithData(el);
        }
      }
      if (evt.target.getAttribute('src') === el.url) {
        showBigPictureWithData(el);
      }
    });
    document.addEventListener('keydown', window.uploadOverlay.onOverlayEscPress);

    document.body.classList.add('modal-open'); // ТЗ 4.3
    bigPictureCloseNode.addEventListener('click', function () {
      document.body.classList.remove('modal-open');
      bigPictureNode.classList.add('hidden');
    });
  };

  // Открывает большую картинку по клику на миниатюру, вешает обработчик закрытия
  picturesListNode.addEventListener('click', function (evt) {
    if (evt.target.className === 'picture__img') {
      onPictureMiniatureEvent(evt);
    }
  });
  picturesListNode.addEventListener('keydown', function (evt) {
    if (evt.target.className === 'picture__link' && evt.keyCode === window.uploadOverlay.keyCodeMap.KEY_ENTER) {
      onPictureMiniatureEvent(evt, true);
    }
  });


  window.bigPicture = {
    node: bigPictureNode
  };
})();
