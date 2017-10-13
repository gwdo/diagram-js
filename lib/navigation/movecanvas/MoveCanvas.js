'use strict';

import Cursor from '../../util/Cursor';
import { install as installClickTrap } from '../../util/ClickTrap';

import { substractPoints } from '../../util/Geometry';

import domEvent from 'min-dom/lib/event';
import domClosest from 'min-dom/lib/closest';

import { toPoint } from '../../util/Event';


function length(point) {
  return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}


var THRESHOLD = 15;


export default class MoveCanvas {

  constructor(eventBus, canvas) {

    var container = canvas._container,
        context;


    function handleMove(event) {

      var start = context.start,
          position = toPoint(event),
          delta = substractPoints(position, start);

      if (!context.dragging && length(delta) > THRESHOLD) {
        context.dragging = true;

        // prevent mouse click in this
        // interaction sequence
        installClickTrap();

        Cursor.set('grab');
      }

      if (context.dragging) {

        var lastPosition = context.last || context.start;

        delta = substractPoints(position, lastPosition);

        canvas.scroll({
          dx: delta.x,
          dy: delta.y
        });

        context.last = position;
      }

      // prevent select
      event.preventDefault();
    }


    function handleEnd(event) {
      domEvent.unbind(document, 'mousemove', handleMove);
      domEvent.unbind(document, 'mouseup', handleEnd);

      context = null;

      Cursor.unset();
    }

    function handleStart(event) {
      // event is already handled by '.djs-draggable'
      if (domClosest(event.target, '.djs-draggable')) {
        return;
      }


      // reject non-left left mouse button or modifier key
      if (event.button || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      context = {
        start: toPoint(event)
      };

      domEvent.bind(document, 'mousemove', handleMove);
      domEvent.bind(document, 'mouseup', handleEnd);
    }

    domEvent.bind(container, 'mousedown', handleStart);
  }
}


MoveCanvas.$inject = [
  'eventBus',
  'canvas'
];
