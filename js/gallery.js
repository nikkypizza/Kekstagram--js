'use strict';

(function () {
  var photoDataMap = {
    photosQuantity: 25,
    likesMax: 200,
    likesMin: 15,
    comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'],
    descriptions: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!']
  };

  // Генерит массив дата-объектов из случайных данных
  var generatePhotoCardsDataArray = function (dataObj) {
    var photosArr = [];

    for (var i = 1; i <= dataObj.photosQuantity; i++) {
      var shuffledComments = window.util.getShuffledArray(dataObj.comments);
      var photoCard = {
        url: 'photos/' + i + '.jpg',
        likes: window.util.getRandomNumber(dataObj.likesMin, dataObj.likesMax),
        comments: window.util.getRandomNumber(0, 1) ? shuffledComments.slice(0, 1) : shuffledComments.slice(0, 2),
        description: dataObj.descriptions[window.util.getRandomNumber(0, dataObj.descriptions.length - 1)]
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

  renderPhotoCards(allPhotosArr);

  window.gallery = {
    picturesListNode: picturesListNode,
    allPhotosArr: allPhotosArr
  };
})();
