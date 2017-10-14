'use strict';

import { hasPrimaryModifier } from '../../util/Mouse';


var HIGH_PRIORITY = 1500;
var HAND_CURSOR = 'grab';

export default class HandTool {

  constructor(eventBus, canvas, dragging, toolManager) {
    this._dragging = dragging;


    toolManager.registerTool('hand', {
      tool: 'hand',
      dragging: 'hand.move'
    });

    eventBus.on('element.mousedown', HIGH_PRIORITY, (event) => {
      if (hasPrimaryModifier(event)) {
        this.activateMove(event.originalEvent);

        return false;
      }
    });


    eventBus.on('hand.end', (event) => {
      var target = event.originalEvent.target;

      // only reactive on diagram click
      // on some occasions, event.hover is not set and we have to check if the target is an svg
      if (!event.hover && !(target instanceof SVGElement)) {
        return false;
      }

      eventBus.once('hand.ended', () => {
        this.activateMove(event.originalEvent, { reactivate: true });
      });

    });


    eventBus.on('hand.move.move', function(event) {
      var scale = canvas.viewbox().scale;

      canvas.scroll({
        dx: event.dx * scale,
        dy: event.dy * scale
      });
    });

    eventBus.on('hand.move.end', (event) => {
      var context = event.context,
          reactivate = context.reactivate;

      // Don't reactivate if the user is using the keyboard keybinding
      if (!hasPrimaryModifier(event) && reactivate) {

        eventBus.once('hand.move.ended', (event) => {
          this.activateHand(event.originalEvent, true, true);
        });

      }

      return false;
    });

  }

  activateMove(event, autoActivate, context) {
    if (typeof autoActivate === 'object') {
      context = autoActivate;
      autoActivate = false;
    }

    this._dragging.init(event, 'hand.move', {
      autoActivate: autoActivate,
      cursor: HAND_CURSOR,
      data: {
        context: context || {}
      }
    });
  }

  activateHand(event, autoActivate, reactivate) {
    this._dragging.init(event, 'hand', {
      trapClick: false,
      autoActivate: autoActivate,
      cursor: HAND_CURSOR,
      data: {
        context: {
          reactivate: reactivate
        }
      }
    });
  }

  toggle() {
    if (this.isActive()) {
      this._dragging.cancel();
    } else {
      this.activateHand();
    }
  }

  isActive() {
    var context = this._dragging.context();

    return context && /^hand/.test(context.prefix);
  }
}

HandTool.$inject = [
  'eventBus',
  'canvas',
  'dragging',
  'toolManager'
];
