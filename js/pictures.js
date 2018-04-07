'use strict';

var photoDataMap = {
  photosQuantity: 25,
  likesMax: 200,
  likesMin: 15,
  comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'],
  description: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'],
};

// Возвращает рандомное чило от min до max, округляет вверх
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/* Возвращает перемешаный массив
 Тасование Фишера — Йетса      */
var getShuffledArray = function (array) {
  var m = array.length;
  while (m) {
    var i = Math.floor(Math.random() * m--);
    var t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

var generatePhotoCardsArray = function () {
  var photosArr = [];

  for (var i = 1; i <= photoDataMap.photosQuantity; i++) {
    var shuffledComments = getShuffledArray(photoDataMap.comments);
    var photoCard = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomNumber(photoDataMap.likesMin, photoDataMap.likesMax),
      comments: getRandomNumber(0, 1) ? shuffledComments[0] + ' ' + shuffledComments[1] : shuffledComments[0],
      description: photoDataMap.description[getRandomNumber(0, photoDataMap.description.length - 1)]
    };
    photosArr.push(photoCard);
  }
  return photosArr;
};

var allPhotosArr = generatePhotoCardsArray();
