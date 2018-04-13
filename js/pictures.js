'use strict';

var photoDataMap = {
  photosQuantity: 25,
  likesMax: 200,
  likesMin: 15,
  comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'],
  descriptions: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!']
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
      likes: getRandomNumber(dataObj.likesMin, dataObj.likesMax),
      comments: getRandomNumber(0, 1) ? shuffledComments.slice(0, 1) : shuffledComments.slice(0, 2),
      description: dataObj.descriptions[getRandomNumber(0, dataObj.descriptions.length - 1)]
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
  for (var i = 0; i < arr.length; i++) {
    var photoElement = photoTemplateNode.cloneNode(true);
    photoElement.querySelector('.picture__img').src = arr[i].url;
    photoElement.querySelector('.picture__stat--comments').textContent = arr[i].comments.length;
    photoElement.querySelector('.picture__stat--likes').textContent = arr[i].likes;
    fragment.appendChild(photoElement);
  }
  picturesListNode.appendChild(fragment);
};

var showBigPictureWithData = function (arrElem) {
  var bigPictureNode = document.querySelector('.big-picture');
  bigPictureNode.classList.remove('hidden');

  bigPictureNode.querySelector('.big-picture__img img').src = arrElem.url;
  bigPictureNode.querySelector('.likes-count').textContent = arrElem.likes;
  bigPictureNode.querySelector('.comments-count').textContent = arrElem.comments.length;

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrElem.comments.length; i++) {
    var socialCommentsList = document.querySelector('.social__comments');
    var commentElem = document.querySelector('.social__comment').cloneNode();
    var commentUserPic = document.querySelector('.social__picture').cloneNode(true);
    var textElem = document.createTextNode(arrElem.comments[i]);

    commentUserPic.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
    commentElem.appendChild(commentUserPic);
    commentElem.appendChild(textElem);
    fragment.appendChild(commentElem);
  }
  // Удаляет из разметки уже существующие комментарии
  while (socialCommentsList.firstChild) {
    socialCommentsList.removeChild(socialCommentsList.firstChild);
  }
  // И добавляет новые
  socialCommentsList.appendChild(fragment);
  // Скрывает ноды с количеством комментариев и спиннером
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
};

renderPhotoCards(allPhotosArr);
// showBigPictureWithData(allPhotosArr[0]);

// —-------module4-task1

var keyCodeMap = {
  KEY_ESC: 27,
  KEY_ENTER: 13
};

var uploadFileInputNode = document.querySelector('#upload-file');
var uploadOverlayNode = document.querySelector('.img-upload__overlay');
var uploadOverlayCloseNode = document.querySelector('#upload-cancel');
var textHashtagsInputNode = document.querySelector('.text__hashtags');
var textDescriptionInputNode = document.querySelector('.text__description');

var onOverlayEscPress = function (evt) {
  if (evt.keyCode === keyCodeMap.KEY_ESC && document.activeElement !== textHashtagsInputNode && document.activeElement !== textDescriptionInputNode) {
  // В ТЗ не нашел этого , но добавил Незакрытие по ESC при фокусе в полях формы (по аналогии с учебным проектом)
    onOverlayClose();
  }
};
var onOverlayOpen = function () {
  uploadOverlayNode.classList.remove('hidden');
  document.addEventListener('keydown', onOverlayEscPress);
};
var onOverlayClose = function () {
  uploadOverlayNode.classList.add('hidden');
  uploadFileInputNode.value = '';
  // Не понимаю куда записывается название файла из <input type="file">, потому не могу понять что именно нужно обнулить при закрытии модалки
  document.removeEventListener('keydown', onOverlayEscPress);
};

uploadFileInputNode.addEventListener('change', onOverlayOpen);

uploadOverlayCloseNode.addEventListener('click', onOverlayClose);
uploadOverlayCloseNode.addEventListener('keydown', function (evt) {
  if (evt.keyCode === keyCodeMap.KEY_ENTER) {
    onOverlayClose();
  }
});

