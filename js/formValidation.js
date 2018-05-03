'use strict';

(function () {
  var textHashtagsInputNode = document.querySelector('.text__hashtags');
  textHashtagsInputNode.addEventListener('blur', function () {
    var hashtagArray = textHashtagsInputNode.value.split(' ');
    var duplicatesCounter = 0;
    textHashtagsInputNode.setCustomValidity('');

    for (var i = 0; i < hashtagArray.length; i++) {
      // Если элементе массива '#' встречается больше 1 раза - кидаем CustomValidity
      if (hashtagArray[i].split('#').length - 1 > 1) {
        textHashtagsInputNode.setCustomValidity('Хеш-теги должны разделяться пробелами');
      }
      if (hashtagArray[i].slice(-1) === '#' || hashtagArray[i].slice(-1) === ',' || hashtagArray[i].slice(-1) === '.' || hashtagArray[i].slice(-1) === '/') {
        textHashtagsInputNode.setCustomValidity('Хеш-тег не может оканчиваться на #, слэш, точку или запятую');
      }
      // Не начинается с '#' ?
      if (hashtagArray[i] !== '' && hashtagArray[i].slice(0, 1) !== '#') {
        textHashtagsInputNode.setCustomValidity('Хеш-тег должен начинаться со знака #');
      }
      if (hashtagArray[i].length > 20) {
        textHashtagsInputNode.setCustomValidity('Длина хеш-тега не может превышать 20 символов');
      }
      // Переводим все элементы в верхний регистр и сравниваем исходный массив с самим собой. Если совпадений больше, чем длинна массива => в нем есть повторы === кидаем CustomValidity
      for (var j = 0; j < hashtagArray.length; j++) {
        if (hashtagArray[i].toUpperCase() === hashtagArray[j].toUpperCase()) {
          duplicatesCounter++;
        }
        if (duplicatesCounter > hashtagArray.length) {
          textHashtagsInputNode.setCustomValidity('Хеш-теги не должны повторяться');
        }
      }
      // Выносим пустоты из массива
      while (hashtagArray[i] === '' || hashtagArray[i] === ' ') {
        hashtagArray.splice(i, 1);
      }
      if (hashtagArray[i] === '#') {
        textHashtagsInputNode.setCustomValidity('Хеш-тег не может состоять из одного символа #');
      }
    }
    if (hashtagArray.length > 5) {
      textHashtagsInputNode.setCustomValidity('Хеш-тегов не может быть более 5');
    }

    textHashtagsInputNode.value = hashtagArray.join(' ');
  });

  var form = document.querySelector('.img-upload__form');

  // Отменяет действие формы по умолчанию и отправляет форму посредством XHR на сервер
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.postRequest(new FormData(form), function () {
      window.uploadOverlay.uploadOverlayNode.classList.add('hidden');
      form.reset();
    }, window.backend.statusNotification);
  });

  window.validation = {
    textHashtagsInputNode: textHashtagsInputNode
  };
})();
