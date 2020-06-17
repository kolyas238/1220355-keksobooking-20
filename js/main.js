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
    var j = getRandomNumber(0, length);
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
        price: getRandomNumber(1000, 10000),
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

var placeAds = function (ads) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(renderPin(ad));
  });
  mapPins.appendChild(fragment);
};

var generatedAds = generateAds(ADS_QUANTITY);
// map.appendChild(placeAds(generatedAds));
placeAds(generatedAds);

// отрисовка карточек

var cardTemplate = document.querySelector('#card')
.content
.querySelector('.map__card');

var renderFeatures = function (element, features) {
  element.innerHTML = '';
  for (var i = 0; i < features.length; i++) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + features[i]);
    element.appendChild(feature);
  }
};

var renderPhotos = function (container, photos) {
  container.innerHTML = '';

  for (var i = 0; i < photos.length; i++) {
    var photoItem = document.createElement('img');
    photoItem.classList.add('popup__photo');
    photoItem.src = photos[i];
    photoItem.width = PHOTO_WIDTH;
    photoItem.height = PHOTO_HEIGHT;
    photoItem.alt = PHOTO_ALT;
    container.appendChild(photoItem);
  }
};

var switchRooms = function (rooms) {
  var str = '';

  switch (rooms) {
    case 1:
      str = '1 комната';
      break;

    case 100:
      str = ' 100 комнат';
      break;

    default:
      str = rooms + ' комнаты';
  }
  return str;
};

var switchGuests = function (guests) {
  var str = '';

  switch (guests) {
    case 0:
      break;

    case 1:
      str = ' для 1 гостя';
      break;

    default:
      str = ' для ' + guests + ' гостей';
  }
  return str;
};

var renderCard = function (ad) {
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

  if (ad.offer.rooms || ad.offer.guests) {
    cardItems.querySelector('.popup__text--capacity').textContent = switchRooms(ad.offer.rooms) + switchGuests(ad.offer.guests);
  } else {
    cardItems.querySelector('.popup__text--capacity').classList.add('visually-hidden');
  }

  if (ad.offer.checkin || ad.offer.checkout) {
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

  return cardItems;
};

var mapFilters = document.querySelector('.map__filters-container');

map.insertBefore(renderCard(generatedAds[0]), mapFilters);

activateMap();
