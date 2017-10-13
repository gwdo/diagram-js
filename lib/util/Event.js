'use strict';

function __preventDefault(event) {
  return event && event.preventDefault();
}

function __stopPropagation(event, immediate) {
  if (!event) {
    return;
  }

  if (event.stopPropagation) {
    event.stopPropagation();
  }

  if (immediate && event.stopImmediatePropagation) {
    event.stopImmediatePropagation();
  }
}


export function getOriginalEvent(event) {
  return event.originalEvent || event.srcEvent;
}


export function stopEvent(event, immediate) {
  stopEventPropagation(event, immediate);
  preventEventDefault(event);
}


export function preventEventDefault(event) {
  __preventDefault(event);
  __preventDefault(getOriginalEvent(event));
}


export function stopEventPropagation(event, immediate) {
  __stopPropagation(event, immediate);
  __stopPropagation(getOriginalEvent(event), immediate);
}


export function toPoint(event) {

  if (event.pointers && event.pointers.length) {
    event = event.pointers[0];
  }

  if (event.touches && event.touches.length) {
    event = event.touches[0];
  }

  return event ? {
    x: event.clientX,
    y: event.clientY
  } : null;
}
