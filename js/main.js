'use strict';

var LOCATION_MIN_X = 0;
var LOCATION_MIN_Y = 130;
var LOCATION_MAX_X = 1200;
var LOCATION_MAX_Y = 630;
var ADS_QUANTITY = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_HEIGHT_ON = 84;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var ENTER_KEY = 13;

var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;
var PHOTO_ALT = 'Фотография жилья';

var map = document.querySelector('.map');

// случайное число
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// случайный элемент массива

var getRandomElement = function (items) {
  var randomIndex = getRandomNumber(0, items.length - 1);
  return items[randomIndex];
};

// перемешивание элементов массива

var shuffleArray = function (items) {
  var clonedItems = items.slice();
  var length = items.length;
  for (var i = 0; i < length; i++) {
    var j = getRandomNumber(0, length - 1);
    var temp = clonedItems[i];
    clonedItems[i] = clonedItems[j];
    clonedItems[j] = temp;
  }
  return clonedItems;
};

var roomTypes = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

// генерация массива объявлений

var generateAds = function (quantity) {

  var ads = [];
  for (var i = 1; i <= quantity; i++) {
    var locationX = getRandomNumber(LOCATION_MIN_X, LOCATION_MAX_X);
    var locationY = getRandomNumber(LOCATION_MIN_Y, LOCATION_MAX_Y);
    var ad = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: '',
        address: locationX + ', ' + locationY,
        price: getRandomNumber(1000, 1000000),
        type: getRandomElement(TYPES),
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 4),
        checkin: getRandomElement(CHECKINS),
        checkout: getRandomElement(CHECKOUTS),
        features: shuffleArray(FEATURES).slice(0, getRandomNumber(1, FEATURES.length)),
        description: '',
        photos: shuffleArray(PHOTOS).slice(0, getRandomNumber(1, PHOTOS.length))
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    ads.push(ad);
  }
  return ads;
};

var activateMap = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
};

var deactivateMap = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
};

// отрисовка меток на карте

var renderPin = function (adPin) {
  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var pinItem = pinTemplate.cloneNode(true);

  pinItem.style.left = (adPin.location.x - PIN_WIDTH / 2) + 'px';
  pinItem.style.top = (adPin.location.y - PIN_HEIGHT) + 'px';
  pinItem.querySelector('img').src = adPin.author.avatar;
  pinItem.querySelector('img').alt = adPin.offer.title;

  return pinItem;
};

var mapPins = document.querySelector('.map__pins');
var placeAds = function (ads) {
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(renderPin(ad));
  });
  mapPins.appendChild(fragment);
};

// отрисовка карточек

var renderFeatures = function (container, features) {
  container.innerHTML = '';
  var fragment = document.createDocumentFragment();
  features.forEach(function (feature) {
    var cardFeature = document.createElement('li');
    fragment.appendChild(cardFeature);
    cardFeature.classList.add('popup__feature', 'popup__feature--' + feature);
  });
  container.appendChild(fragment);
};

var renderPhotos = function (container, photos) {
  container.innerHTML = '';
  var fragment = document.createDocumentFragment();
  photos.forEach(function (photo) {
    var photoItem = document.createElement('img');
    fragment.appendChild(photoItem);
    photoItem.classList.add('popup__photo');
    photoItem.src = photo;
    photoItem.width = PHOTO_WIDTH;
    photoItem.height = PHOTO_HEIGHT;
    photoItem.alt = PHOTO_ALT;
    container.appendChild(photoItem);
  });
};

var switchRooms = function (rooms) {

  switch (rooms) {
    case 1:
      return rooms + ' комната';

    case 2:
    case 3:
    case 4:
      return rooms + ' комнаты';
    case 100:
      return rooms + 'комнат';
    default:
      return rooms + ' комнат';
  }
};

var switchGuests = function (guests) {

  switch (guests) {
    case 100:
      return 'не для гостей';

    case 1:
      return ' для ' + guests + ' гостя';

    default:
      return ' для ' + guests + ' гостей';
  }
};

var renderCard = function (ad) {
  var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
  // var mapFilters = document.querySelector('.map__filters-container');

  var cardItems = cardTemplate.cloneNode(true);
  var cardFeatures = cardItems.querySelector('.popup__features');
  var cardPhotos = cardItems.querySelector('.popup__photos');

  cardItems.querySelector('.popup__title').textContent = ad.offer.title;
  cardItems.querySelector('.popup__description').textContent = ad.offer.description;
  cardItems.querySelector('.popup__text--address').textContent = ad.offer.address;

  if (ad.offer.price) {
    cardItems.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  } else {
    cardItems.querySelector('.popup__text--price').classList.add('visually-hidden');
  }

  if (ad.offer.type) {
    cardItems.querySelector('.popup__type').textContent = roomTypes[ad.offer.type];
  } else {
    cardItems.querySelector('.popup__type').classList.add('visually-hidden');
  }

  if (ad.offer.rooms && ad.offer.guests) {
    cardItems.querySelector('.popup__text--capacity').textContent = switchRooms(ad.offer.rooms) + switchGuests(ad.offer.guests);
  } else {
    cardItems.querySelector('.popup__text--capacity').classList.add('visually-hidden');
  }

  if (ad.offer.checkin && ad.offer.checkout) {
    cardItems.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  } else {
    cardItems.querySelector('.popup__text--time').classList.add('visually-hidden');
  }

  if (ad.offer.features) {
    renderFeatures(cardFeatures, ad.offer.features);
  } else {
    cardFeatures.classList.add('visually-hidden');
  }

  if (ad.offer.photos) {
    renderPhotos(cardPhotos, ad.offer.photos);
  } else {
    cardPhotos.classList.add('visually-hidden');
  }

  if (ad.author.avatar) {
    cardItems.querySelector('.popup__avatar').src = ad.author.avatar;
  } else {
    cardItems.querySelector('.popup__avatar').classList.add('visually-hidden');
  }


  // map.insertBefore(cardItems, mapFilters);
};

var generatedAds = generateAds(ADS_QUANTITY);


// activateMap();
renderCard(generatedAds[0]);

var mainPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
// var filtersForm = document.querySelector('.map__filters');
var formFieldsets = adForm.querySelectorAll('fieldset');
var addressInput = adForm.querySelector('input[name="address"]');
// var titleInput = adForm.querySelector('input[name="title"]');
var roomsSelect = adForm.querySelector('select[name="rooms"]');
var capacitySelect = adForm.querySelector('select[name="capacity"]');

var getDisabledAddress = function () {
  var locationX = Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2);
  var locationY = Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT / 2);

  addressInput.value = locationX + ', ' + locationY;
};

var getEnabledAddress = function () {
  var locationX = Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2);
  var locationY = Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT_ON);

  addressInput.value = locationX + ', ' + locationY;
};


var fieldsetsDisable = function (fieldsets) {
  fieldsets.forEach(function (fieldset) {
    fieldset.setAttribute('disabled', 'disabled');
  });
};

fieldsetsDisable(formFieldsets);

var fieldsetsEnable = function (fieldsets) {
  fieldsets.forEach(function (fieldset) {
    fieldset.removeAttribute('disabled', 'disabled');
  });
};

var deletePins = function () {
  var renderedPins = map.querySelectorAll('.map__pin:nth-child(n+3)');
  renderedPins.forEach(function (pin) {
    pin.remove();
  });
};

var enableService = function () {
  activateMap();
  fieldsetsEnable(formFieldsets);
  getEnabledAddress();
  placeAds(generatedAds);
  mainPin.removeEventListener('keydown', mainPinEnterPress);
  mainPin.removeEventListener('mousedown', mainPinMouseClick);
};

var disableService = function () {
  deactivateMap();
  getDisabledAddress();
  fieldsetsDisable(formFieldsets);
  placeAds(generatedAds);
  mainPin.addEventListener('keydown', mainPinEnterPress);
  mainPin.addEventListener('mousedown', mainPinMouseClick);
  deletePins();
};

var mainPinEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEY) {
    enableService();
  }
};

var mainPinMouseClick = function (evt) {
  if (evt.button === 0) {
    enableService();
  }
};


var roomPlacesError = {
  1: {
    capacity: ['1'],
    error: 'Для 1 гостя'
  },
  2: {
    capacity: ['1', '2'],
    error: 'Для 1 или 2 гостей'
  },
  3: {
    capacity: ['1', '2', '3'],
    error: 'Для 1, 2, или 3 гостей'
  },
  100: {
    capacity: ['0'],
    error: 'Не для гостей'
  }
};


var validateRooms = function () {
  var guestsQty = capacitySelect.value;
  var roomsQty = roomsSelect.value;

  if (roomPlacesError[roomsQty].capacity.includes(guestsQty)) {
    roomsSelect.setCustomValidity('');
  } else {
    roomsSelect.setCustomValidity(roomPlacesError[roomsQty].error);
  }
};

var onCapacityChange = function () {
  validateRooms();
};

capacitySelect.addEventListener('change', onCapacityChange);
roomsSelect.addEventListener('change', onCapacityChange);


enableService();
disableService();
validateRooms();
