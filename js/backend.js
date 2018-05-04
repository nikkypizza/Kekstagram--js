'use strict';

(function () {
  window.backend = {
    // Функция получения данных
    getRequest: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        var alert;
        switch (xhr.status) {
          case 200:
            alert = 'Данные загружены успешно';
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
        onError(alert);
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
        var alert;
        switch (xhr.status) {
          case 200:
            alert = 'Форма отправлена успешно';
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
        onError(alert);
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
    },
  };
})();
