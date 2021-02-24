(function($) {
  "use strict"; // Start of use strict

    // up
    var btn = $('.scroll-to-top');

    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            $('.scroll-to-top').addClass('show');
        } else {
            $('.scroll-to-top').removeClass('show');
        }
    });
    btn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 900);
    });

  new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    adaptiveHeight: true,
    autoplay: {
      delay: 3000,
    },
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
      simulateTouch: true,
    },
    // Navigation arrows
    navigation: {
      
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

  });

  // ВТОРОЙ Header

  $(window).scroll(function () {
      if ($(window).scrollTop() > 500) {
        $('.menu-header').addClass('menu-header-show');
      } else {
        $('.menu-header').removeClass('menu-header-show');
      }
    });

  // ВСПЛЫВАЮЩЕЕ ОКНО УСЛУГИ

  $('.menu-item__services').hover(function () {
    $(this).children('.services-popup').stop(false, true).fadeIn(600);
  }, function () {
    $(this).children('.services-popup').stop(false, true).fadeOut(600);
  });
  $('.popup2-menu-item__services').hover(function () {
    $(this).children('.services-popup').stop(false, true).fadeIn(600);
  }, function () {
    $(this).children('.services-popup').stop(false, true).fadeOut(600);
  });

  // Опускающаяся кнопка Services и поднимающийся text

  $(".services-styles-item").hover(function() {
    $(this).children('.btn-third').stop(false, true).toggleClass("show animated fadeInDown animate__delay-0.1s");
    $(this).children('.services-styles-item__text').stop(false, true).toggleClass("services-styles-item__text-up")(100);
  }, function ()
  {
    $(this).children('.btn-third').stop(false, true).removeClass("show animated fadeInDown");
    $(this).children('.services-styles-item__text').stop(false, true).removeClass("services-styles-item__text-up")(100);
  });

  // ВСПЛЫВАЮЩЕЕ ОКНО ПЕРЕЗВОН

  $(document).ready(function () {
    let link = $('.order-call__icon');
    let link_active = $('.order-call-icon-close');
    let navigation = $('.order-call-popup');

    link.click(function(){

      link.toggleClass('order-call__icon__none');
      link_active.toggleClass('order-call-icon-close__block');
      navigation.toggleClass('order-call-show');

    });

    link_active.click(function(){
      navigation.removeClass('order-call-show');
      link.removeClass('order-call__icon__none');
      link_active.removeClass('order-call-icon-close__block');
    });
  });


  // MENU-BURGER
  $(document).ready(function () {
    var link = $('.burger-link');
    var link_active = $('.burger-link_active');
    var nav_active = $('.popup2');

    link.click(function(){
      link.toggleClass('burger-link_active');
      // navigation.toggleClass('nav-active');
      nav_active.toggleClass('popup2-active');
      $('html').toggleClass('body_fix')
    });

    link_active.click(function(){
      // navigation.removeClass('nav-active');
      nav_active.removeClass('popup2-active');
      $('html').removeClass('body_fix')
    });
  });
  $(function() {
    $('a.burger-link').on('click', function(event) {
      event.preventDefault();
    });
  });


})(jQuery); // End of use strict


$(document).ready(function () {
  let openMap = $('.open-map');
  let mapContainer = $('.map');
  openMap.click(function(){
    mapContainer.toggleClass('none')
    mapContainer.addClass('fadeOut')

    $(this).text(function(i, text) {
      return text === "Показать карту" ? "Скрыть карту" : "Показать карту";
    });
  });
});


// MAP
//Переменная для включения/отключения индикатора загрузки
var spinner = $('.ymap-container').children('.loader');
//Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
var check_if_load = false;
//Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
var myMapTemp, myPlacemarkTemp;

//Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
function init () {
  var myMapTemp = new ymaps.Map("map-yandex", {
    center: [55.541015, 37.493255], // координаты центра на карте
    zoom: 17, // коэффициент приближения карты
    controls: ['zoomControl', 'fullscreenControl'] // выбираем только те функции, которые необходимы при использовании
  });
  var myPlacemarkTemp = new ymaps.Placemark([55.541015, 37.493255], {
    balloonContent: "Здесь может быть ваш адрес",
  }, {
    // Опции.
    // Необходимо указать данный тип макета.
    iconLayout: 'default#imageWithContent',
    // Своё изображение иконки метки.
    iconImageHref: './img/strizhki/map-marker.png',
    // Размеры метки.
    iconImageSize: [50, 50],
    // Смещение левого верхнего угла иконки относительно
    // её "ножки" (точки привязки).
    iconImageOffset: [-25, -50],
  });
  myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту

  // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
  var layer = myMapTemp.layers.get(0).get(0);

  // Решение по callback-у для определения полной загрузки карты
  waitForTilesLoad(layer).then(function() {
    // Скрываем индикатор загрузки после полной загрузки карты
    spinner.removeClass('is-active');
  });
}


// Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов)
function waitForTilesLoad(layer) {
  return new ymaps.vow.Promise(function (resolve, reject) {
    var tc = getTileContainer(layer), readyAll = true;
    tc.tiles.each(function (tile, number) {
      if (!tile.isReady()) {
        readyAll = false;
      }
    });
    if (readyAll) {
      resolve();
    } else {
      tc.events.once("ready", function() {
        resolve();
      });
    }
  });
}

function getTileContainer(layer) {
  for (var k in layer) {
    if (layer.hasOwnProperty(k)) {
      if (
          layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
          || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
      ) {
        return layer[k];
      }
    }
  }
  return null;
}

// Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
function loadScript(url, callback){
  var script = document.createElement("script");

  if (script.readyState){  // IE
    script.onreadystatechange = function(){
      if (script.readyState == "loaded" ||
          script.readyState == "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  // Другие браузеры
    script.onload = function(){
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;
var ymap = function() {
  $('.ymap-container').mouseenter(function(){
        if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

          // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
          check_if_load = true;

          // Показываем индикатор загрузки до тех пор, пока карта не загрузится
          spinner.addClass('is-active');

          // Загружаем API Яндекс.Карт
          loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;loadByRequire=1", function(){
            // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
            ymaps.load(init);
          });
        }
      }
  );
}

$(function() {

  //Запускаем основную функцию
  ymap();

});
// MAP2
//Переменная для включения/отключения индикатора загрузки
var spinner2 = $('.ymap-container2').children('.loader2');
//Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
var check_if_load2 = false;
//Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
var myMapTemp2, myPlacemarkTemp2;

//Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
function init2 () {
  var myMapTemp2 = new ymaps.Map("map-yandex2", {
    center: [55.541015, 37.493255], // координаты центра на карте
    zoom: 17, // коэффициент приближения карты
    controls: ['zoomControl', 'fullscreenControl'] // выбираем только те функции, которые необходимы при использовании
  });
  var myPlacemarkTemp2 = new ymaps.Placemark([55.541015, 37.493255], {
    balloonContent: "Здесь может быть ваш адрес",
  }, {
    // Опции.
    // Необходимо указать данный тип макета.
    iconLayout: 'default#imageWithContent',
    // Своё изображение иконки метки.
    iconImageHref: './img/strizhki/map-marker.png',
    // Размеры метки.
    iconImageSize: [50, 50],
    // Смещение левого верхнего угла иконки относительно
    // её "ножки" (точки привязки).
    iconImageOffset: [-25, -50],
  });
  myMapTemp2.geoObjects.add(myPlacemarkTemp2); // помещаем флажок на карту

  // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
  var layer = myMapTemp2.layers.get(0).get(0);

  // Решение по callback-у для определения полной загрузки карты
  waitForTilesLoad2(layer).then(function() {
    // Скрываем индикатор загрузки после полной загрузки карты
    spinner2.removeClass('is-active');
  });
}

// Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов)
function waitForTilesLoad2(layer) {
  return new ymaps.vow.Promise(function (resolve, reject) {
    var tc = getTileContainer2(layer), readyAll = true;
    tc.tiles.each(function (tile, number) {
      if (!tile.isReady()) {
        readyAll = false;
      }
    });
    if (readyAll) {
      resolve();
    } else {
      tc.events.once("ready", function() {
        resolve();
      });
    }
  });
}

function getTileContainer2(layer) {
  for (var k in layer) {
    if (layer.hasOwnProperty(k)) {
      if (
          layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
          || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
      ) {
        return layer[k];
      }
    }
  }
  return null;
}

// Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
function loadScript2(url, callback){
  var script = document.createElement("script");

  if (script.readyState){  // IE
    script.onreadystatechange = function(){
      if (script.readyState == "loaded" ||
          script.readyState == "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  // Другие браузеры
    script.onload = function(){
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;
var ymap2 = function() {
  $('.ymap-container2').mouseenter(function(){
        if (!check_if_load2) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

          // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
          check_if_load2 = true;

          // Показываем индикатор загрузки до тех пор, пока карта не загрузится
          spinner2.addClass('is-active');

          // Загружаем API Яндекс.Карт
          loadScript2("https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;loadByRequire=1", function(){
            // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
            ymaps.load(init2);
          });
        }
      }
  );
}

$(function() {

  //Запускаем основную функцию
  ymap2();

});





// ANIMATION

let animItems = document.querySelectorAll('._anim-items');
if (animItems.length > 0) {
  window.addEventListener('scroll', animOnScroll);
  function animOnScroll(params) {
      for (let index = 0; index < animItems.length; index++) {
        const animItem = animItems[index];
        const animItemHeight = animItem.offsetHeight;
        const animItemOffset = offset(animItem).top;
        const animStart = 4;

        let animItemPoint = window.innerHeight - animItemHeight / animStart;
        if (animItemHeight > window.innerHeight) {
          animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }
        if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemPoint)) {
          animItem.classList.add('_active');
        } else {
          if (!animItem.classList.contains('_anim-no-hide')) {
            animItem.classList.remove('_active');
          }
        }
      }
  }
  function offset(el) {
    const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
  }
  setTimeout(() => {
    animOnScroll()
  }, 200)
}


// POPUP

jQuery(document).ready(function () {
  jQuery("form").submit(function () {
    var form_data = jQuery(this).serialize();
    jQuery.ajax({
      type: "POST",
      url: "sendform.php",
      data: form_data,
      success: swal({
        title:"Спасибо за заявку!",
        type: "success",
        showConfirmButton: false,
        timer: 20000
      })
    });
    $('.order-call-popup').removeClass('order-call-show animate__fadeIn')
    // $('.order-call__icon').toggleClass('order-call__icon__none animate__fadeIn')
    // $('.order-close').addClass('order-call__icon__none animate__fadeIn')
    $('html').removeClass('body_fix')
    event.preventDefault();
  });
});




























