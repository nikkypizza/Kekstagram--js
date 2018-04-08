'use strict';

var photoDataMap = {
  photosQuantity: 25,
  likesMax: 200,
  likesMin: 15,
  comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'],
  description: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!']
};

// Возвращает рандомное чило от min до max
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/* Возвращает перемешаный массив
 Тасование Фишера — Йетса      */
var getShuffledArray = function (arr) {
  var m = arr.length;
  while (m) {
    var i = Math.floor(Math.random() * m--);
    var t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

// Генерит массив дата-объектов из случайных данных
var generatePhotoCardsDataArray = function (dataObj) {
  var photosArr = [];

  for (var i = 1; i <= dataObj.photosQuantity; i++) {
    var shuffledComments = getShuffledArray(dataObj.comments);
    var photoCard = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomNumber(dataObj.likesMin, photoDataMap.likesMax),
      comments: getRandomNumber(0, 1) ? shuffledComments[0] + ' ' + shuffledComments[1] : shuffledComments[0],
      description: dataObj.description[getRandomNumber(0, dataObj.description.length - 1)]
    };
    photosArr.push(photoCard);
  }
  return photosArr;
};

var allPhotosArr = generatePhotoCardsDataArray(photoDataMap);

// Подставляет данные из массива объектов в фрагменты и встраивает их на страницу
var renderPhotoCards = function (arr) {
  var photoTemplateNode = document.querySelector('#picture').content.querySelector('.picture__link');
  var picturesListNode = document.querySelector('.pictures');

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photoDataMap.photosQuantity; i++) {
    var photoElement = photoTemplateNode.cloneNode(true);
    photoElement.querySelector('.picture__img').src = arr[i].url;
    photoElement.querySelector('.picture__stat--comments').textContent = arr[i].comments;
    photoElement.querySelector('.picture__stat--likes').textContent = arr[i].likes;
    fragment.appendChild(photoElement);
  }
  picturesListNode.appendChild(fragment);
};

renderPhotoCards(allPhotosArr);
