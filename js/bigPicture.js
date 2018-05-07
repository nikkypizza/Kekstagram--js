'use strict';

(function () {
  var bigPictureNode = document.querySelector('.big-picture');
  var bigPictureCloseNode = bigPictureNode.querySelector('.big-picture__cancel');
  var socialCommentsList = bigPictureCloseNode.querySelector('.social__comments');
  var picturesListNode = document.querySelector('.pictures');

  var showBigPictureWithData = function (arrElem) {
    bigPictureNode.classList.remove('hidden');

    bigPictureNode.querySelector('.social__caption').textContent = arrElem.comments[0];
    bigPictureNode.querySelector('.big-picture__img img').src = arrElem.url;
    bigPictureNode.querySelector('.likes-count').textContent = arrElem.likes;
    bigPictureNode.querySelector('.comments-count').textContent = arrElem.comments.length;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrElem.comments.length; i++) {
      var commentElem = document.querySelector('.social__comment').cloneNode();
      var commentUserAvatarPicture = document.querySelector('.social__picture').cloneNode(true);
      var textElem = document.createTextNode(arrElem.comments[i]);
      // Первый коммент далее используется как шаблон. Удаляем его атрибут style со св-вом display='none'
      commentElem.style = null;

      commentUserAvatarPicture.src = 'img/avatar-' + window.util.getRandomNumber(1, 6) + '.svg';
      commentElem.appendChild(commentUserAvatarPicture);
      commentElem.appendChild(textElem);
      fragment.appendChild(commentElem);
    }
    // Удаляет из разметки уже существующие комментарии
    while (socialCommentsList.firstChild) {
      socialCommentsList.removeChild(socialCommentsList.firstChild);
    }
    // И добавляет новые
    socialCommentsList.appendChild(fragment);
    // Первый элемент массива comments используется как social__caption, потому прячем его из socialCommentsList
    socialCommentsList.firstChild.style.display = 'none';
    // Скрывает ноды с количеством комментариев и спиннером
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
  };
  var onPictureMinClick = function (evt) {

    if (evt.target.parentElement.className === 'picture__link') {
      var target = evt.target;
      for (var i = 0; i < window.gallery.allPhotosArr.length; i++) {
        if (target.getAttribute('src') === window.gallery.allPhotosArr[i].url) {
          showBigPictureWithData(window.gallery.allPhotosArr[i]);
        }
      }
      document.addEventListener('keydown', window.uploadOverlay.onOverlayEscPress);

      document.body.classList.add('modal-open'); // ТЗ 4.3
      bigPictureCloseNode.addEventListener('click', function () {
        document.body.classList.remove('modal-open');
        bigPictureNode.classList.add('hidden');
      });
    }

  };

  // Открывает большую картинку по клику на миниатюру, вешает обработчик закрытия
  picturesListNode.addEventListener('click', onPictureMinClick);

  window.bigPicture = {
    node: bigPictureNode
  };
})();
