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

var showBigPictureWithData = function () {
  var bigPictureNode = document.querySelector('.big-picture');
  bigPictureNode.classList.remove('hidden');
  bigPictureNode.querySelector('.big-picture__img img').src = allPhotosArr[0].url;
  bigPictureNode.querySelector('.likes-count').textContent = allPhotosArr[0].likes;
  bigPictureNode.querySelector('.social__caption').textContent = allPhotosArr[0].description;
  bigPictureNode.querySelector('.comments-count').textContent = allPhotosArr[0].comments.length; // ??

  var commentElement = document.querySelector('.social__comment').cloneNode();
  var commentPictureElement = document.querySelector('.social__picture').cloneNode(true);

  // Удаляет из разметки уже существующие комментарии (предположил, что так нужно, но я не уверен)
  var socialCommentsList = document.querySelector('.social__comments');
  while (socialCommentsList.firstChild) {
    socialCommentsList.removeChild(socialCommentsList.firstChild);
  }

  // Добавляет в разметку новый комментарий с данными из первого объекта массива данных
  var fragment = document.createDocumentFragment();
  var text = document.createTextNode(allPhotosArr[0].comments); // Создал новую текст ноду, ибо если использовать textContent, то это затирает все содержимое
  commentPictureElement.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';

  commentElement.appendChild(commentPictureElement);
  commentElement.appendChild(text);

  fragment.appendChild(commentElement);
  socialCommentsList.appendChild(fragment);

  // Скрывает ноды с комментами и спиннером
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
};

renderPhotoCards(allPhotosArr);
showBigPictureWithData();
