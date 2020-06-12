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

var map = document.querySelector('.map');

var activateMap = function () {
  map.classList.remove('map--faded');
};

activateMap();

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
map.appendChild(placeAds(generatedAds));
