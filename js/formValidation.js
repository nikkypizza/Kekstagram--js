'use strict';

(function () {
  var xhrStatusNodeConstantsMap = {
    REMOVE_TIMEOUT: 3000, // 3 секунды
    OPACITY_REFRESH_RATE: 45
  };
  var uploadFormNode = document.querySelector('.img-upload__form');
  var textHashtagsInputNode = uploadFormNode.querySelector('.text__hashtags');
  var formSubmitBtn = uploadFormNode.querySelector('#upload-submit');

  formSubmitBtn.addEventListener('click', function () {
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
  // Отменяет действие формы по умолчанию и отправляет форму посредством XHR на сервер
  uploadFormNode.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.postRequest(new FormData(uploadFormNode), function () {
      window.uploadOverlay.node.classList.add('hidden');
      uploadFormNode.reset();
      displayXhrStatus('Форма отправлена успешно');
    }, displayXhrStatus);
  });

  // Отрисовка окна со статусом xhr запроса
  var displayXhrStatus = function (message) {
    var dataGetSuccess = 'Данные загружены успешно';
    var formPostSuccess = 'Форма отправлена успешно';

    var errorNode = document.createElement('div');
    errorNode.style.position = 'fixed';
    errorNode.style.top = '60px';
    errorNode.style.width = '100%';
    errorNode.style.padding = '20px';
    errorNode.style.backgroundColor = 'rgba(225, 0, 0, 0.55)'; // Полупрозрачный красный
    errorNode.style.outline = '2px solid rgba(255, 0, 0, 0.7)';
    errorNode.style.textAlign = 'center';
    errorNode.style.zIndex = '100';
    errorNode.textContent = 'Эррор! ' + message;
    errorNode.id = 'serverStatus';
    if (message === dataGetSuccess || message === formPostSuccess) {
      errorNode.style.backgroundColor = 'rgba(0, 128, 0, 0.55)'; // Полупрозрачный зеленый
      errorNode.style.outline = '2px solid rgba(0, 128, 0, 0.7)';
      errorNode.textContent = message;
    }
    document.body.insertAdjacentElement('afterbegin', errorNode);

    // Плавно снижает прозрачность статусного дива. Если прозрачность <= 0 > удаляет блок статуса
    setTimeout(function () {
      var statusNode = document.querySelector('#serverStatus');
      var statStyle = statusNode.style;
      statStyle.opacity = 1;

      var slowlyRemoveStatusNode = function () {
        if (statStyle.opacity > 0) {
          statStyle.opacity -= 0.1;
        }
        if (statStyle.opacity <= 0) {
          statusNode.remove();
        } else {
          setTimeout(slowlyRemoveStatusNode, xhrStatusNodeConstantsMap.OPACITY_REFRESH_RATE);
        }
      };
      slowlyRemoveStatusNode();
    }, xhrStatusNodeConstantsMap.REMOVE_TIMEOUT);
  };

  window.formValidation = {
    uploadFormNode: uploadFormNode,
    textHashtagsInputNode: textHashtagsInputNode,
    displayXhrStatus: displayXhrStatus
  };
})();
