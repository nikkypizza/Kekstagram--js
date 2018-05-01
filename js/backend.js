'use strict';

(function () {

  // Функция получения данных
  var load = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/kekstagram/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var alert;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          alert = 'Неверный запрос';
          break;
        case 401:
          alert = 'Пользователь не авторизован';
          break;
        case 404:
          alert = 'Ничего не найдено';
          break;
        default:
          onError(xhr.status + ': ' + xhr.statusText);
      }
      if (alert) {
        onError(alert);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения, попробуйте обновить страницу');
    });
    xhr.addEventListener('timeout', function () {
      onError('Время ожидания соединения исктекло');
    });
    xhr.timeout = 10000; // 10сек
    xhr.open('GET', URL);
    xhr.send();
  };

  // Функция отправки данных
  var save = function (data, onLoad, onError) {
    var URL = 'https://js.dump.academy/kekstagram';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var alert;
      switch (xhr.status) {
        case 200:
          onLoad();
          break;
        case 400:
          alert = 'Неверный запрос';
          break;
        case 401:
          alert = 'Пользователь не авторизован';
          break;
        case 404:
          alert = 'Ничего не найдено';
          break;
        default:
          alert = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (alert) {
        onError(alert);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Неуспешное выполнение запроса. Попробуйте обновить страницу и повторить запрос');
    });
    xhr.addEventListener('timeout', function () {
      onError('Время ожидания соединения исктекло.');
    });
    xhr.timeout = 10000; // 10сек
    xhr.open('POST', URL);
    xhr.send(data);
  };

  // Отрисовка окна со статусом ошибки
  var errorNotification = function (message) {
    var errorNode = document.createElement('div');
    errorNode.style.position = 'fixed';
    errorNode.style.top = '15px';
    errorNode.style.width = '100%';
    errorNode.style.padding = '20px';
    errorNode.style.backgroundColor = 'rgba(225, 0, 0, 0.55)';
    errorNode.style.outline = '2px solid rgba(255, 0, 0, 0.7)';
    errorNode.style.textAlign = 'center';
    errorNode.style.zIndex = '100';
    errorNode.textContent = 'Эррор! ' + message;
    errorNode.id = 'serverStatus';

    document.body.insertAdjacentElement('afterbegin', errorNode);

    // Плавно снижает прозрачность статусного дива. Есди прозрачность = 0 -> вешает display: none
    setTimeout(function () {
      var statusNode = document.querySelector('#serverStatus');
      var statStyle = statusNode.style;
      statStyle.opacity = 1;
      (function fade() {
        if (statStyle.opacity > 0) {
          statStyle.opacity -= 0.1;
        }
        if (statStyle.opacity === 0) {
          statStyle.display = 'none';
        } else {
          setTimeout(fade, 45);
        }
      })();
    }, 4000); // Сообщение висит 4 секунды
  };

  window.backend = {
    load: load,
    save: save,
    errorNotification: errorNotification
  };
})();
