'use strict';

var bind = require('lodash/function/bind');


class MouseTracking {
  constructor(eventBus, canvas) {
    this._eventBus = eventBus;
    this._canvas = canvas;

    this._init();
  }

  getHoverContext() {
    var viewbox = this._canvas.viewbox();

    return {
      element: this._hoverElement,
      point: {
        x: viewbox.x + Math.round(this._mouseX / viewbox.scale),
        y: viewbox.y + Math.round(this._mouseY / viewbox.scale)
      }
    };
  }

  _init() {
    var eventBus = this._eventBus,
        canvas = this._canvas;

    var container = canvas.getContainer();

    this._setMousePosition = bind(this._setMousePosition, this);

    container.addEventListener('mousemove', this._setMousePosition);

    eventBus.on('diagram.destroy', function() {
      container.removeEventListener('mousemove', this._setMousePosition);
    }, this);

    eventBus.on('element.hover', this._setHoverElement, this);
  }

  _setHoverElement(event) {
    this._hoverElement = event.element;
  }

  _setMousePosition(event) {
    this._mouseX = event.layerX;
    this._mouseY = event.layerY;
  }
}

MouseTracking.$inject = [
  'eventBus',
  'canvas'
];

module.exports = MouseTracking;
