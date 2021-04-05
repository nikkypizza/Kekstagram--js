'use strict';

(function () {
  var IMG_DEFAULT_PREVIEW_SRC = 'img/upload-default-image.jpg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'ico', 'svg', 'webp'];
  var keyCodeMap = {
    KEY_ESC: 27,
    KEY_ENTER: 13
  };

  var uploadOverlayNode = document.querySelector('.img-upload__overlay');
  var uploadOverlayCloseNode = uploadOverlayNode.querySelector('#upload-cancel');
  var textDescriptionInputNode = uploadOverlayNode.querySelector('.text__description');
  var filtersPreviewNodes = uploadOverlayNode.querySelectorAll('.effects__preview');
  var uploadFileInputNode = document.querySelector('#upload-file');

  var replaceFiltersPreviewImageAddress = function (address) {
    window.photoEffects.uploadPreviewImgNode.src = address;
    filtersPreviewNodes.forEach(function (el) {
      el.style.backgroundImage = 'url(' + address + ')'; // Подставляет превью в миниатюры фильтров
    });
  };

  var onOverlayEscPress = function (evt) {
    if (evt.keyCode === keyCodeMap.KEY_ESC && document.activeElement !== window.formValidation.textHashtagsInputNode && document.activeElement !== textDescriptionInputNode) {
      onOverlayClose();
      window.bigPicture.node.classList.add('hidden');
    }
  };
  // Обнуляет все изменения модального окна
  var resetAllFormFilters = function () {
    window.photoEffects.effectScaleNode.classList.add('hidden');
    window.photoEffects.uploadPreviewImgNode.style = '';
    window.photoEffects.uploadPreviewImgNode.classList = '';
    window.photoEffects.scaleValueInputNode.value = null;
    window.photoEffects.resizeValueInputNode.value = '100%';
    replaceFiltersPreviewImageAddress(IMG_DEFAULT_PREVIEW_SRC); // Возвращает превью в значение по умолчанию
  };

  var onOverlayOpen = function () {
    document.addEventListener('keydown', onOverlayEscPress);
    uploadOverlayNode.classList.remove('hidden');
  };

  var onOverlayClose = function () {
    uploadOverlayNode.classList.add('hidden');
    document.body.classList.remove('modal-open');
    uploadFileInputNode.value = '';
    resetAllFormFilters(); // ТЗ 3.5
    document.removeEventListener('keydown', onOverlayEscPress);
  };

  uploadFileInputNode.addEventListener('change', onOverlayOpen);

  uploadOverlayCloseNode.addEventListener('click', onOverlayClose);
  uploadOverlayCloseNode.addEventListener('keydown', function (evt) {
    if (evt.keyCode === keyCodeMap.KEY_ENTER) {
      onOverlayClose();
    }
  });

  // Подставляет в превью загружаемый файл
  uploadFileInputNode.addEventListener('change', function () {
    var firstUploadedFile = uploadFileInputNode.files[0];
    var fileName = firstUploadedFile.name.toLowerCase();
    var matches = FILE_TYPES.some(function (el) {
      return fileName.endsWith(el);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        replaceFiltersPreviewImageAddress(reader.result); // Подставляет превью загруженного изображения
      });
      reader.readAsDataURL(firstUploadedFile);
    }
  });

  window.uploadOverlay = {
    node: uploadOverlayNode,
    keyCodeMap: keyCodeMap,
    onOverlayEscPress: onOverlayEscPress,
    resetAllFormFilters: resetAllFormFilters
  };
})();
