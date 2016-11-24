/**
 *
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SCRouter = function (_HTMLElement) {
  _inherits(SCRouter, _HTMLElement);

  function SCRouter() {
    _classCallCheck(this, SCRouter);

    return _possibleConstructorReturn(this, (SCRouter.__proto__ || Object.getPrototypeOf(SCRouter)).apply(this, arguments));
  }

  _createClass(SCRouter, [{
    key: '_onChanged',
    value: function _onChanged() {
      var _this2 = this;

      var path = window.location.pathname;
      var routes = Array.from(this._routes.keys());
      var route = routes.find(function (r) {
        return r.test(path);
      });
      console.dir(route);
      console.log("----------");
      console.log(path);
      var data = route.exec(path);

      if (!route) {
        return;
      }

      // Store the new view.
      this._newView = this._routes.get(route);

      // We don't want to create more promises for the outgoing view animation,
      // because then we get a lot of hanging Promises, so we add a boolean gate
      // here to stop if there's already a transition running.
      if (this._isTransitioningBetweenViews) {
        return Promise.resolve();
      }
      this._isTransitioningBetweenViews = true;

      // Assume that there's no outgoing animation required.
      var outViewPromise = Promise.resolve();

      // If there is a current view...
      if (this._currentView) {
        // ...and it's the one we already have, just update it.
        if (this._currentView === this._newView) {
          // No transitions, so remove the boolean gate.
          this._isTransitioningBetweenViews = false;

          return this._currentView.update(data);
        }

        // Otherwise animate it out, and take the Promise made by the view as an
        // indicator that the view is done.
        outViewPromise = this._currentView.out(data);
      }

      // Whenever the outgoing animation is done (which may be immediately if
      // there isn't one), update the references to the current view, allow
      // outgoing animations to proceed.
      return outViewPromise.then(function (_) {
        _this2._currentView = _this2._newView;
        _this2._isTransitioningBetweenViews = false;
        return _this2._newView.in(data);
      });
    }
  }, {
    key: 'go',
    value: function go(url) {
      window.history.pushState(null, null, url);
      return this._onChanged();
    }
  }, {
    key: 'addRoute',
    value: function addRoute(route, view) {
      if (this._routes.has(route)) return console.warn('Route already exists: ' + route);

      this._routes.set(route, view);
    }
  }, {
    key: '_addRoutes',
    value: function _addRoutes() {
      var _this3 = this;

      var views = Array.from(document.querySelectorAll('sc-view'));
      views.forEach(function (view) {
        if (!view.route) return;

        _this3.addRoute(new RegExp(view.route, 'i'), view);
      }, this);
    }
  }, {
    key: '_removeRoute',
    value: function _removeRoute(route) {
      this._routes.delete(route);
    }
  }, {
    key: '_clearRoutes',
    value: function _clearRoutes() {
      this._routes.clear();
    }
  }, {
    key: 'createdCallback',
    value: function createdCallback() {
      this._onChanged = this._onChanged.bind(this);
      this._routes = new Map();
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      window.addEventListener('popstate', this._onChanged);
      this._clearRoutes();
      this._addRoutes();
      this._onChanged();
    }
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {
      window.removeEventListener('popstate', this._onChanged);
    }
  }]);

  return SCRouter;
}(HTMLElement);

document.registerElement('sc-router', SCRouter);
