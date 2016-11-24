'use strict'

var main = document.querySelector('.pt-main'),
  pageSection = '.pt-page',
  menuItem = document.querySelectorAll('.pt-anchor'),
  currentPageClass = "pt-page-current",
  currentHash = window.location.hash.slice(1),
  nextHash;

var PageAnim = function(mainEl) {
  this.pages = mainEl.children;
  this.firstPage = this.pages[0];
  this.windowHash = window.location.hash.slice(1);
};

PageAnim.prototype.checkHash = function(hash) {
  var pageHash = main
    .querySelector(pageSection + "[data-anchor = " + hash + "]");

  if (pageHash) {
    return true;
  } else {
    return false;
  }
};

PageAnim.prototype.changePage = function(nextHash) {
  var self = this;
  var nextPage = main.querySelector(
    pageSection + "[data-anchor = " + nextHash + "]");
  [].forEach.call(document.querySelectorAll(pageSection), function(el) {
    if (currentHash != '' && self.checkHash(currentHash)) {
      if (el.classList.contains(currentHash)) {
        el.classList.remove(currentPageClass);
      }
    } else {
      el.classList.remove(currentPageClass);
    }
  });
  nextPage.classList.add(currentPageClass);

};

PageAnim.prototype.init = function() {
  var self = this;
  var prev, next;

  currentHash = '',
    prev = window.location.hash;

  window.addEventListener('hashchange', function() {
    setInterval(function() {
      next = window.location.hash;
      if (prev === next) return;
      nextHash = next.slice(1);
      currentHash = prev.slice(1);
      prev = next;

      if (nextHash === '') {
        nextHash = self.firstPage.dataset.anchor;
        self.changePage(nextHash);
      }
      if (self.checkHash(nextHash)) {
        self.changePage(nextHash);
      }
    }, 100);
  });

  if (this.windowHash === '' || !this.checkHash(this.windowHash)) {
    nextHash = this.firstPage.dataset.anchor;
    this.changePage(nextHash);
  } else {
    nextHash = this.windowHash;
    self.changePage(nextHash);
  }
};

document.addEventListener("DOMContentLoaded", function() {

  if (main) {
    var pageAnim = new PageAnim(main);
    pageAnim.init();
  }
});
