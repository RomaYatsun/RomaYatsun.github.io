'use strict';

var router = document.querySelector('sc-router');
var links = Array.from(document.querySelectorAll('a'));

function onClick(evt) {
  evt.preventDefault();
  router.go(evt.target.href);
}

links.forEach(function (link) {
  link.addEventListener('click', onClick);
});