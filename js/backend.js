'use strict';

(function () {
  // Если при отправке данных произошла ошибка запроса = показать блок. ТЗ 3.4
  var onPostRequestError = function () {
    var errorNode = document.querySelector('.img-upload__message--error');
    var tryAgainLink = errorNode.firstElementChild.firstElementChild;
    var uploadAgainLink = errorNode.firstElementChild.lastElementChild;
    var imgUploadInput = document.querySelector('.img-upload__input');
    window.uploadOverlay.uploadOverlayNode.classList.add('hidden');

    window.uploadOverlay.resetAllFormFilters();
    errorNode.classList.remove('hidden');
    tryAgainLink.addEventListener('click', function () {
      errorNode.classList.add('hidden');
      window.formValidation.uploadFormNode.reset();
    });
    uploadAgainLink.addEventListener('click', function () {
      errorNode.classList.add('hidden');
      window.formValidation.uploadFormNode.reset();
      imgUploadInput.click();
    });
  };

  window.backend = {
    // Функция получения данных
    getRequest: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        var errorMessage;
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          case 400:
            errorMessage = 'Неверный запрос';
            break;
          case 401:
            errorMessage = 'Пользователь не авторизован';
            break;
          case 404:
            errorMessage = 'Ничего не найдено';
            break;
          default:
            onError(xhr.status + ': ' + xhr.statusText);
        }
        if (errorMessage) {
          onError(errorMessage);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения, попробуйте обновить страницу');
      });
      xhr.addEventListener('timeout', function () {
        onError('Время ожидания соединения истекло');
      });
      xhr.timeout = 10000; // 10сек
      xhr.open('GET', URL);
      xhr.send();
    },

    // Функция отправки данных
    postRequest: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        var errorMessage;
        switch (xhr.status) {
          case 200:
            onLoad();
            break;
          case 400:
            errorMessage = 'Неверный запрос';
            onPostRequestError();
            break;
          case 401:
            errorMessage = 'Пользователь не авторизован';
            onPostRequestError();
            break;
          case 404:
            errorMessage = 'Ничего не найдено';
            onPostRequestError();
            break;
          default:
            errorMessage = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
            onPostRequestError();
        }
        if (errorMessage) {
          onError(errorMessage);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Неуспешное выполнение запроса. Попробуйте обновить страницу и повторить запрос');
        onPostRequestError();
      });
      xhr.addEventListener('timeout', function () {
        onError('Время ожидания соединения исктекло.');
        onPostRequestError();
      });
      xhr.timeout = 10000; // 10сек
      xhr.open('POST', URL);
      xhr.send(data);
    },
  };
})();
