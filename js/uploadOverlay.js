'use strict';

(function () {
  var keyCodeMap = {
    KEY_ESC: 27,
    KEY_ENTER: 13
  };

  var uploadFileInputNode = document.querySelector('#upload-file');
  var uploadOverlayNode = document.querySelector('.img-upload__overlay');
  var uploadOverlayCloseNode = document.querySelector('#upload-cancel');
  var textDescriptionInputNode = document.querySelector('.text__description');

  var onOverlayEscPress = function (evt) {
    if (evt.keyCode === keyCodeMap.KEY_ESC && document.activeElement !== window.validation.textHashtagsInputNode && document.activeElement !== textDescriptionInputNode) {
      onOverlayClose();
      window.bigPicture.bigPictureNode.classList.add('hidden');
    }
  };
  var onOverlayOpen = function () {
    uploadOverlayNode.classList.remove('hidden');
    window.photoEffects.effectScaleNode.classList.add('hidden');
    document.addEventListener('keydown', onOverlayEscPress);
  };
  // При закрытии модалки возвращает все поля формы и значения фильтра в исходное положение
  var onOverlayClose = function () {
    uploadOverlayNode.classList.add('hidden');

    // Обнуляет все изменения при закрытии модального окна
    uploadFileInputNode.value = '';
    window.photoEffects.uploadPreviewNode.removeAttribute('style');
    window.photoEffects.uploadPreviewNode.removeAttribute('class');
    window.photoEffects.scaleValueInputNode.removeAttribute('value');
    window.photoEffects.uploadPreviewNode.querySelector('img').removeAttribute('style');
    window.photoEffects.resizeValueInput.value = 100 + '%';
    window.photoEffects.filterNoneNode.selected = true;
    document.removeEventListener('keydown', onOverlayEscPress);
  };

  uploadFileInputNode.addEventListener('change', onOverlayOpen);

  uploadOverlayCloseNode.addEventListener('click', onOverlayClose);
  uploadOverlayCloseNode.addEventListener('keydown', function (evt) {
    if (evt.keyCode === keyCodeMap.KEY_ENTER) {
      onOverlayClose();
    }
  });

  window.uploadOverlay = {
    onOverlayEscPress: onOverlayEscPress,
    uploadOverlayNode: uploadOverlayNode
  };
})();
