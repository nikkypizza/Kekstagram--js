'use strict';

(function () {
  var filtersListNode = document.querySelector('.effects__list');
  var uploadPreviewNode = document.querySelector('.img-upload__preview');
  var uploadPreviewImgNode = uploadPreviewNode.querySelector('img');
  // Список переменных шкалы фильтра
  var effectScaleNode = document.querySelector('.img-upload__scale');
  var scaleLineNode = effectScaleNode.querySelector('.scale__line');
  var scalePinNode = scaleLineNode.querySelector('.scale__pin');
  var scaleLevelNode = scaleLineNode.querySelector('.scale__level');
  var scaleValueInputNode = effectScaleNode.querySelector('.scale__value');
  // Список переменных ноды изменения размеров
  var uploadResizeNode = document.querySelector('.img-upload__resize');
  var resizeMinusNode = uploadResizeNode.querySelector('.resize__control--minus');
  var resizePlusNode = uploadResizeNode.querySelector('.resize__control--plus');
  var resizeValueInput = uploadResizeNode.querySelector('.resize__control--value');
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
      uploadPreviewImgNode.style = 'filter: grayscale(' + depth + ');';
      scaleValueInputNode.setAttribute('value', depth);
    }
    if (filterSepiaNode.checked) {
      uploadPreviewImgNode.style = 'filter: sepia(' + depth + ');';
      scaleValueInputNode.setAttribute('value', depth);
    }
    if (filterMarvinNode.checked) {
      uploadPreviewImgNode.style = 'filter: invert(' + depth * 100 + '%);';
      scaleValueInputNode.setAttribute('value', depth * 100 + '%');
    }
    if (filterPhobosNode.checked) {
      uploadPreviewImgNode.style = 'filter: blur(' + depth * 3 + 'px);';
      scaleValueInputNode.setAttribute('value', (depth * 3).toFixed(2) + 'px');
    }
    if (filterHeatNode.checked) {
      uploadPreviewImgNode.style = 'filter: brightness(' + depth * 3 + ');';
      scaleValueInputNode.setAttribute('value', (depth * 3).toFixed(2));
    }
  };

  var onFilterChange = function (scaleIsHidden, filterClassNameAdd) {
    uploadPreviewImgNode.removeAttribute('class');
    // Если шкала спрятана ( === выбран вариант без фильтра) - обнуляет фильтры превью и значение фильтра в форме
    if (scaleIsHidden) {
      effectScaleNode.classList.add('hidden');
      scaleValueInputNode.removeAttribute('value');
    } else {
      effectScaleNode.classList.remove('hidden');
    }
    if (filterClassNameAdd) {
      uploadPreviewImgNode.className = filterClassNameAdd;
    }
    // При переключении фильтров - увеличивает значение фильтра до 100% согласно ТЗ
    scalePinNode.style.left = scaleLineNode.offsetWidth + 'px';
    scaleLevelNode.style.width = '100%';
    refreshFilterDepth();
  };

  filtersListNode.addEventListener('click', function (evt) {
    switch (evt.target) {
      case filterChromeNode:
        onFilterChange(false, filtersClassNameMap.chrome);
        break;
      case filterSepiaNode:
        onFilterChange(false, filtersClassNameMap.sepia);
        break;
      case filterMarvinNode:
        onFilterChange(false, filtersClassNameMap.marvin);
        break;
      case filterPhobosNode:
        onFilterChange(false, filtersClassNameMap.phobos);
        break;
      case filterHeatNode:
        onFilterChange(false, filtersClassNameMap.heat);
        break;
      default:
        onFilterChange(true);
        break;
    }
  });

  // Вешает обработчик обновления фильтра
  scalePinNode.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var xStartCoords = evt.clientX;

    var onMouseMove = function (moveEvt) {
      var shift = xStartCoords - moveEvt.clientX;
      xStartCoords = moveEvt.clientX;
      moveEvt.preventDefault();

      scalePinNode.style.left = (scalePinNode.offsetLeft - shift) + 'px';
      scaleLevelNode.style.width = (scalePinNode.offsetLeft / scaleLineNode.offsetWidth * 100) + '%';

      // Задаем пину и полосе точки экстремума
      if (scalePinNode.offsetLeft <= 0) {
        scalePinNode.style.left = '0px';
        scaleLevelNode.style.width = '0%';
      }
      if (scalePinNode.offsetLeft >= scaleLineNode.offsetWidth) {
        scalePinNode.style.left = scaleLineNode.offsetWidth + 'px';
        scaleLevelNode.style.width = '100%';
      }
      refreshFilterDepth();
    };
    // При отпускании мыши сбрасываем все обработчики фильтров
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Меняет размер изображения, записывает данные в инпут
  var onImgResize = function (scaleDown, scaleUp) {
    var inputValue = parseInt(resizeValueInput.value, 10);
    var maxValue = 100;
    var minValue = 25;
    var step = 25;
    if (scaleDown) {
      if (inputValue > minValue) {
        uploadPreviewNode.style.transform = 'scale(0.' + (inputValue - step) + ')';
        resizeValueInput.value = inputValue - step + '%';
      }
    }
    if (scaleUp) {
      if (inputValue < maxValue) {
        uploadPreviewNode.style.transform = 'scale(0.' + (inputValue + step) + ')';
        resizeValueInput.value = inputValue + step + '%';
        if (parseInt(resizeValueInput.value, 10) === maxValue) {
          uploadPreviewNode.removeAttribute('style');
          resizeValueInput.value = maxValue + '%';
        }
      }
    }
  };

  uploadResizeNode.addEventListener('click', function (evt) {
    switch (evt.target) {
      case resizeMinusNode:
        onImgResize(true);
        break;
      case resizePlusNode:
        onImgResize(false, true);
        break;
    }
  });

  window.photoEffects = {
    filterNoneNode: filterNoneNode,
    effectScaleNode: effectScaleNode,
    uploadPreviewNode: uploadPreviewNode,
    uploadPreviewImgNode: uploadPreviewImgNode,
    scaleValueInputNode: scaleValueInputNode,
    resizeValueInput: resizeValueInput
  };
})();
