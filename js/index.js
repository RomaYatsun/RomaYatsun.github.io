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

PageAnim.prototype.clickMenuHash = function() {
  var self = this;

  [].forEach.call(menuItem, function(el) {

    el.addEventListener('click', function(e) {
      currentHash = window.location.hash.slice(1);
      if (self.checkHash(this.hash.slice(1))) {
        nextHash = this.hash.slice(1);
      };
      // self.changePage(nextHash);
    })
  });

};

PageAnim.prototype.changePage = function(nextHash) {
  var nextPage = main.querySelector(
    pageSection + "[data-anchor = " + nextHash + "]");
  if (currentHash != '') {
    [].forEach.call(document.querySelectorAll(pageSection), function(el) {
      if (el.classList.contains(currentHash)) {
        console.log(currentHash);
        el.classList.remove(currentPageClass);
      } else {
        el.classList.remove(currentPageClass);
      }
    });
  }
  nextPage.classList.add(currentPageClass);

};

PageAnim.prototype.updateHash = function() {

  if (this.windowHash === '') {
    nextHash = this.firstPage.dataset.anchor;
    this.windowHash = this.firstPage.dataset.anchor;
  }
  this.changePage(nextHash);
};


PageAnim.prototype.init = function() {
  var self = this;
  currentHash = '';
  this.clickMenuHash();
  window.addEventListener('hashchange', function() {
    self.updateHash();
  });

  if (this.windowHash === '' || !this.checkHash(this.windowHash)) {
    nextHash = this.firstPage.dataset.anchor;
    this.changePage(nextHash);
  } else {
    nextHash = this.windowHash;
    self.updateHash();
  }
};

document.addEventListener("DOMContentLoaded", function() {

  if (main) {
    var pageAnim = new PageAnim(main);
    pageAnim.init();
  }
});
