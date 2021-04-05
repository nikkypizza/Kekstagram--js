'use strict';

(function () {
  var XHR_TIMEOUT = 10000; // 10 секунд
  var xhrRequestAddressMap = {
    GET: 'https://22.javascript.pages.academy/kekstagram/data',
    POST: 'https://22.javascript.pages.academy/kekstagram'
  };
  // Если при отправке данных произошла ошибка запроса = показать блок. ТЗ 3.4
  var onPostRequestError = function () {
    var errorNode = document.querySelector('.img-upload__message--error');
    var tryAgainLinkNode = errorNode.firstElementChild.firstElementChild;
    var reuploadLinkNode = errorNode.firstElementChild.lastElementChild;
    var imgUploadInputNode = document.querySelector('.img-upload__input');
    window.uploadOverlay.node.classList.add('hidden');

    window.uploadOverlay.resetAllFormFilters();
    errorNode.classList.remove('hidden');
    tryAgainLinkNode.addEventListener('click', function () {
      errorNode.classList.add('hidden');
      window.formValidation.uploadFormNode.reset();
    });
    reuploadLinkNode.addEventListener('click', function () {
      errorNode.classList.add('hidden');
      window.formValidation.uploadFormNode.reset();
      imgUploadInputNode.click();
    });
  };

  window.backend = {
    // Функция получения данных
    getRequest: function (onLoad, onError) {
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
      xhr.timeout = XHR_TIMEOUT;
      xhr.open('GET', xhrRequestAddressMap.GET);
      xhr.send();
    },

    // Функция отправки данных
    postRequest: function (data, onLoad, onError) {
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
      xhr.timeout = XHR_TIMEOUT;
      xhr.open('POST', xhrRequestAddressMap.POST);
      xhr.send(data);
    },
  };
})();
