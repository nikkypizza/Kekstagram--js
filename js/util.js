'use strict';

(function () {
  window.util = {
    // Возвращает рандомное чиcло от min до max
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },
    /* Возвращает перемешаный массив
   Тасование Фишера — Йетса */
    getShuffledArray: function (arr) {
      var m = arr.length;
      while (m) {
        var i = Math.floor(Math.random() * m--);
        var t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
      }
      return arr;
    }
  };
})();
