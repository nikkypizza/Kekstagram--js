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

var picturesListNode = document.querySelector('.pictures');
// Подставляет данные из массива объектов в фрагменты и встраивает их на страницу
var renderPhotoCards = function (arr) {
  var photoTemplateNode = document.querySelector('#picture').content.querySelector('.picture__link');

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

var bigPictureNode = document.querySelector('.big-picture');

var showBigPictureWithData = function (arrElem) {
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
    onOverlayClose();
    bigPictureNode.classList.add('hidden');
  }
};
var onOverlayOpen = function () {
  uploadOverlayNode.classList.remove('hidden');
  effectScaleNode.classList.add('hidden');
  document.addEventListener('keydown', onOverlayEscPress);
};
// При закрытии модалки возвращает все поля формы и значения фильтра в исходное положение
var onOverlayClose = function () {
  uploadOverlayNode.classList.add('hidden');

  // Обнуляет все изменения при закрытии модального окна
  uploadFileInputNode.value = '';
  uploadPreviewNode.removeAttribute('style');
  uploadPreviewNode.removeAttribute('class');
  scaleValueInputNode.removeAttribute('value');
  uploadPreviewNode.querySelector('img').removeAttribute('style');
  resizeValueInput.value = 100 + '%';
  filterNoneNode.selected = true;
  document.removeEventListener('keydown', onOverlayEscPress);
};

uploadFileInputNode.addEventListener('change', onOverlayOpen);

uploadOverlayCloseNode.addEventListener('click', onOverlayClose);
uploadOverlayCloseNode.addEventListener('keydown', function (evt) {
  if (evt.keyCode === keyCodeMap.KEY_ENTER) {
    onOverlayClose();
  }
});


var filtersListNode = document.querySelector('.effects__list');
var uploadPreviewNode = document.querySelector('.img-upload__preview');
// Список переменных шкалы фильтра
var effectScaleNode = document.querySelector('.img-upload__scale');
var scaleLineNode = effectScaleNode.querySelector('.scale__line');
var scalePinNode = scaleLineNode.querySelector('.scale__pin');
var scaleLevelNode = scaleLineNode.querySelector('.scale__level');
var scaleValueInputNode = document.querySelector('.scale__value');
// Список переменных ноды изменения размеров
var uploadResizeNode = document.querySelector('.img-upload__resize');
var resizeMinusNode = uploadResizeNode.querySelector('.resize__control--minus');
var resizePlusNode = uploadResizeNode.querySelector('.resize__control--plus');
var resizeValueInput = uploadResizeNode.querySelector('.resize__control--value');

var bigPictureCloseNode = document.querySelector('.big-picture__cancel');

document.querySelector('.img-upload__resize').style = 'z-index: 100'; // При смене фильтров пропадали кнопки масштаба, не смог понять почему так => добавил z-index

// Список элементов-фильтров по ID
var filterChromeNode = filtersListNode.querySelector('#effect-chrome');
var filterSepiaNode = filtersListNode.querySelector('#effect-sepia');
var filterMarvinNode = filtersListNode.querySelector('#effect-marvin');
var filterPhobosNode = filtersListNode.querySelector('#effect-phobos');
var filterHeatNode = filtersListNode.querySelector('#effect-heat');
var filterNoneNode = filtersListNode.querySelector('#effect-none');

var filtersClassNameMap = {
  chrome: 'effects__preview--chrome',
  sepia: 'effects__preview--sepia',
  marvin: 'effects__preview--marvin',
  phobos: 'effects__preview--phobos',
  heat: 'effects__preview--heat'
};

// Получает соотношение шкалы уровня к общей длине шкалы и подставляет это значение в подходящем формате в атрибут style
var refreshFilterDepth = function () {
  var getEffectDepth = function () {
    return (scaleLevelNode.offsetWidth / scaleLineNode.offsetWidth).toFixed(2);
  };
  var depth = getEffectDepth();
  if (filterChromeNode.checked) {
    uploadPreviewNode.style = 'filter: grayscale(' + depth + ');';
    scaleValueInputNode.setAttribute('value', depth);
  }
  if (filterSepiaNode.checked) {
    uploadPreviewNode.style = 'filter: sepia(' + depth + ');';
    scaleValueInputNode.setAttribute('value', depth);
  }
  if (filterMarvinNode.checked) {
    uploadPreviewNode.style = 'filter: invert(' + depth * 100 + '%);';
    scaleValueInputNode.setAttribute('value', depth * 100 + '%');
  }
  if (filterPhobosNode.checked) {
    uploadPreviewNode.style = 'filter: blur(' + depth * 3 + 'px);';
    scaleValueInputNode.setAttribute('value', (depth * 3).toFixed(2) + 'px');
  }
  if (filterHeatNode.checked) {
    uploadPreviewNode.style = 'filter: brightness(' + depth * 3 + ');';
    scaleValueInputNode.setAttribute('value', (depth * 3).toFixed(2));
  }
};

var onFilterChange = function (scaleIsHidden, filterClassNameAdd) {
  uploadPreviewNode.removeAttribute('class');
  // Если шкала спрятана ( === выбран вариант без фильтра) - обнуляет фильтры превью и значение фильтра в форме
  if (scaleIsHidden) {
    effectScaleNode.classList.add('hidden');
    uploadPreviewNode.removeAttribute('style');
    scaleValueInputNode.removeAttribute('value');
  } else {
    effectScaleNode.classList.remove('hidden');
  }
  if (filterClassNameAdd) {
    uploadPreviewNode.className = filterClassNameAdd;
  }
  refreshFilterDepth();
};

filtersListNode.addEventListener('click', function (evt) {
  switch (evt.target) {
    case filterChromeNode :
      onFilterChange(false, filtersClassNameMap.chrome);
      break;
    case filterSepiaNode :
      onFilterChange(false, filtersClassNameMap.sepia);
      break;
    case filterMarvinNode :
      onFilterChange(false, filtersClassNameMap.marvin);
      break;
    case filterPhobosNode :
      onFilterChange(false, filtersClassNameMap.phobos);
      break;
    case filterHeatNode :
      onFilterChange(false, filtersClassNameMap.heat);
      break;
    default:
      onFilterChange(true);
      break;
  }
});

// Вешает обработчик отпускания клика на пин фильтра
scalePinNode.addEventListener('mouseup', refreshFilterDepth);

// Меняет размер изображения, записывает данные в инпут
var onImgResize = function (scaleDown, scaleUp) {
  var img = uploadPreviewNode.querySelector('img');
  var inputValue = parseInt(resizeValueInput.value, 10);
  var maxValue = 100;
  var minValue = 25;
  var step = 25;
  if (scaleDown) {
    if (inputValue > minValue) {
      img.style.transform = 'scale(0.' + (inputValue - step) + ')';
      resizeValueInput.value = inputValue - step + '%';
    }
  }
  if (scaleUp) {
    if (inputValue < maxValue) {
      img.style.transform = 'scale(0.' + (inputValue + step) + ')';
      resizeValueInput.value = inputValue + step + '%';
      if (parseInt(resizeValueInput.value, 10) === maxValue) {
        img.removeAttribute('style');
        resizeValueInput.value = maxValue + '%';
      }
    }
  }
};

uploadResizeNode.addEventListener('click', function (evt) {
  switch (evt.target) {
    case resizeMinusNode :
      onImgResize(true);
      break;
    case resizePlusNode:
      onImgResize(false, true);
      break;
  }
});


var onPictureMinClick = function (evt) {
  if (evt.target.parentElement.className === 'picture__link') {
    var target = evt.target;
    for (var i = 0; i < allPhotosArr.length; i++) {
      if (target.getAttribute('src') === allPhotosArr[i].url) {
        showBigPictureWithData(allPhotosArr[i]);
      }
    }
    document.addEventListener('keydown', onOverlayEscPress);
    bigPictureCloseNode.addEventListener('click', function () {
      bigPictureNode.classList.add('hidden');
    });
  }
};

// Открывает большую картинку по клику на миниатюру, вешает обработчик закрытия
picturesListNode.addEventListener('click', onPictureMinClick);

// --- module4-task2

textHashtagsInputNode.addEventListener('blur', function () {
  var hashtagArray = textHashtagsInputNode.value.split(' ');
  var duplicatesCounter = 0;
  textHashtagsInputNode.setCustomValidity('');

  for (var i = 0; i < hashtagArray.length; i++) {
    // Если элементе массива '#' встречается больше 1 раза - кидаем CustomValidity
    if (hashtagArray[i].split('#').length - 1 > 1) {
      textHashtagsInputNode.setCustomValidity('Хеш-теги должны разделяться пробелами');
    }
    if (hashtagArray[i].slice(-1) === '#' || hashtagArray[i].slice(-1) === ',' || hashtagArray[i].slice(-1) === '.' || hashtagArray[i].slice(-1) === '/') {
      textHashtagsInputNode.setCustomValidity('Хеш-тег не может заканчиваться на #, слеш, точку или иметь запятую на конце');
    }
    // Не начинается с '#' ?
    if (hashtagArray[i] !== '' && hashtagArray[i].slice(0, 1) !== '#') {
      textHashtagsInputNode.setCustomValidity('Хеш-тег должен начинаться со знака #');
    }
    if (hashtagArray[i].length > 20) {
      textHashtagsInputNode.setCustomValidity('Длина хеш-тега не может превышать 20 символов');
    }
    // Переводим все элементы в верхний регистр и сравниваем исходный массив с самим собой. Если совпадений больше, чем длинна массива => в нем есть повторы === кидаем CustomValidity
    for (var j = 0; j < hashtagArray.length; j++) {
      if (hashtagArray[i].toUpperCase() === hashtagArray[j].toUpperCase()) {
        duplicatesCounter++;
      }
      if (duplicatesCounter > hashtagArray.length) {
        textHashtagsInputNode.setCustomValidity('Хеш-теги не должны повторяться');
      }
    }
    // Выносим пустоты из массива
    while (hashtagArray[i] === '' || hashtagArray[i] === ' ') {
      hashtagArray.splice(i, 1);
    }
    if (hashtagArray[i] === '#') {
      textHashtagsInputNode.setCustomValidity('Хеш-тег не может состоять из одного символа #');
    }
  }
  if (hashtagArray.length > 5) {
    textHashtagsInputNode.setCustomValidity('Хеш-тегов не может быть более 5');
  }

  textHashtagsInputNode.value = hashtagArray.join(' ');
});
