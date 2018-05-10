'use strict';

(function () {
  var xhrStatusNodeConstantsMap = {
    REMOVE_TIMEOUT: 3000, // 3 секунды
    OPACITY_REFRESH_RATE: 45
  };
  var validationCriteriaMap = {
    MAX_STRING_LENGTH: 20,
    MAX_HASHTAGS_AMOUNT: 5,
    badEndsOfString: ['#', ',', '.', '/']
  };
  var uploadFormNode = document.querySelector('.img-upload__form');
  var textHashtagsInputNode = uploadFormNode.querySelector('.text__hashtags');

  var validateHashtags = function () {
    var hashtagArray = textHashtagsInputNode.value.split(' ');
    var duplicatesCounter = 0;
    textHashtagsInputNode.setCustomValidity('');

    hashtagArray.forEach(function (currentItem, index) {
      var badStringEnding = validationCriteriaMap.badEndsOfString.some(function (el) {
        return currentItem.endsWith(el);
      });

      // Если элементе массива '#' встречается больше 1 раза - кидаем CustomValidity
      if (currentItem.split('#').length - 1 > 1) {
        textHashtagsInputNode.setCustomValidity('Хеш-теги должны разделяться пробелами');
      }
      if (badStringEnding) {
        textHashtagsInputNode.setCustomValidity('Хеш-тег не может оканчиваться на #, слэш, точку или запятую');
      }
      // Не начинается с '#' ?
      if (currentItem !== '' && currentItem.slice(0, 1) !== '#') {
        textHashtagsInputNode.setCustomValidity('Хеш-тег должен начинаться со знака #');
      }
      if (currentItem.length > validationCriteriaMap.MAX_STRING_LENGTH) {
        textHashtagsInputNode.setCustomValidity('Длина хеш-тега не может превышать ' + validationCriteriaMap.MAX_STRING_LENGTH + ' символов');
      }
      // Удаляем дублирующиеся пробелы из массива
      if (currentItem === '' && hashtagArray[index + 1] === '') {
        hashtagArray.splice(index, 1);
      }
      if (hashtagArray[validationCriteriaMap.MAX_HASHTAGS_AMOUNT] === '') {
        hashtagArray.splice(hashtagArray.indexOf(''), 1);// Хеш-тегов не может быть более 5
      }
      if (hashtagArray.length > validationCriteriaMap.MAX_HASHTAGS_AMOUNT) {
        textHashtagsInputNode.setCustomValidity('Хеш-тегов не может быть более' + validationCriteriaMap.MAX_HASHTAGS_AMOUNT);
      }

      // Переводим все элементы в верхний регистр и сравниваем исходный массив с самим собой. Если совпадений больше, чем длинна массива => в нем есть повторы === кидаем CustomValidity
      hashtagArray.forEach(function (el) {
        if (currentItem.toUpperCase() === el.toUpperCase()) {
          duplicatesCounter++;
        }
      });

      if (duplicatesCounter > hashtagArray.length) {
        textHashtagsInputNode.setCustomValidity('Хеш-теги не должны повторяться');
      }
      if (currentItem === '#') {
        textHashtagsInputNode.setCustomValidity('Хеш-тег не может состоять из одного символа #');
      }
    });

    textHashtagsInputNode.value = hashtagArray.join(' ');
  };

  // Вешает на инпут валидацию хештегов
  textHashtagsInputNode.addEventListener('input', validateHashtags);
  // Отменяет действие формы по умолчанию и отправляет форму посредством XHR на сервер
  uploadFormNode.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.postRequest(new FormData(uploadFormNode), function () {
      window.uploadOverlay.node.classList.add('hidden');
      displayXhrStatus('Форма отправлена успешно');
      uploadFormNode.reset();
      window.uploadOverlay.resetAllFormFilters();
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
