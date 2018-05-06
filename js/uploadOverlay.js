'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var keyCodeMap = {
    KEY_ESC: 27,
    KEY_ENTER: 13
  };

  var uploadFileInputNode = document.querySelector('#upload-file');
  var uploadOverlayNode = document.querySelector('.img-upload__overlay');
  var uploadOverlayCloseNode = document.querySelector('#upload-cancel');
  var textDescriptionInputNode = document.querySelector('.text__description');

  var onOverlayEscPress = function (evt) {
    if (evt.keyCode === keyCodeMap.KEY_ESC && document.activeElement !== window.formValidation.textHashtagsInputNode && document.activeElement !== textDescriptionInputNode) {
      onOverlayClose();
      window.bigPicture.bigPictureNode.classList.add('hidden');
    }
  };
  // Обнуляет все изменения модального окна
  var resetAllFormFilters = function () {
    window.photoEffects.uploadPreviewNode.style = '';
    window.photoEffects.uploadPreviewImgNode.style = '';
    window.photoEffects.uploadPreviewImgNode.removeAttribute('class');
    window.photoEffects.scaleValueInputNode.removeAttribute('value');
    window.photoEffects.resizeValueInput.value = '100%';
    window.photoEffects.filterNoneNode.checked = true;
    window.photoEffects.uploadPreviewImgNode.src = 'img/upload-default-image.jpg'; // Возвращает превью в значение по умолчанию
  };

  var onOverlayOpen = function () {
    uploadOverlayNode.classList.remove('hidden');
    window.photoEffects.effectScaleNode.classList.add('hidden');
    document.addEventListener('keydown', onOverlayEscPress);
    resetAllFormFilters(); // Обнуляет при открытии, ибо xhr отменяет действие формы по умалчанию
  };

  var onOverlayClose = function () {
    document.body.removeAttribute('class');
    uploadOverlayNode.classList.add('hidden');
    uploadFileInputNode.value = '';
    resetAllFormFilters();
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
    var file = uploadFileInputNode.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        window.photoEffects.uploadPreviewImgNode.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  window.uploadOverlay = {
    onOverlayEscPress: onOverlayEscPress,
    uploadOverlayNode: uploadOverlayNode,
    resetAllFormFilters: resetAllFormFilters
  };
})();
