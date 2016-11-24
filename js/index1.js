'use strict'

var main = document.querySelector('.pt-main'),
  pageSection = '.pt-page',
  menuItem = document.querySelectorAll('.pt-anchor'),
  currentPageClass = "pt-page-current";

var PageAnim = function(mainEl) {
  this.pages = mainEl.children;
  this.firstPage = this.pages[0];
  this.currentHash = window.location.hash;
  this.nextHash = '';

  this.defaultOutClass = 'pt-page-moveToLeft';
  this.defaultInClass = 'pt-page-moveFromRight';
  this.outClass = function(element) {
    return element.dataset.outClass || this.defaultOutClass;
  };
  this.inClass = function(element) {
    return element.dataset.inClass || this.defaultInClass;
  };
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

  // [].forEach.call(document.querySelectorAll(pageSection), function(el) {
  //   el.classList.add(self.outClass(el));
  //   if (self.checkHash(self.nextHash)) {
  //     if (el.classList.contains(prev.slice(1))) {
  //       el.classList.remove(self.outClass(el));
  //       el.classList.add(self.inClass(el));
  //       el.classList.add(currentPageClass);
  //     }
  //   };
  // });

};

PageAnim.prototype.init = function() {
  var self = this;
  var prev, next;
  prev = this.currentHash;

  [].forEach.call(document.querySelectorAll(pageSection), function(el) {
    el.classList.add(self.outClass(el));
    if (self.checkHash(prev.slice(1))) {
      if (el.classList.contains(prev.slice(1))) {
        el.classList.remove(self.outClass(el));
        el.classList.add(self.inClass(el));
        el.classList.add(currentPageClass);
      }
    };
  });

  window.addEventListener('hashchange', function() {

      next = window.location.hash;
      if (prev === next) return;
      self.nextHash = next.slice(1);
      self.currentHash = prev.slice(1);
      prev = next;

      if (self.nextHash === '') {
        self.nextHash = self.firstPage.dataset.anchor;
        self.changePage(self.nextHash);
      }
      if (self.checkHash(self.nextHash)) {
        self.changePage(self.nextHash);
      }
  })
};
document.addEventListener("DOMContentLoaded", function() {
  if (main) {
    var pageAnim = new PageAnim(main);
    pageAnim.init();
  }

});
