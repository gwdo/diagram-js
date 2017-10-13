'use strict';

import domClasses from 'min-dom/lib/classes';

var CURSOR_CLS_PATTERN = /^djs-cursor-.*$/;


function set(mode) {
  var classes = domClasses(document.body);

  classes.removeMatching(CURSOR_CLS_PATTERN);

  if (mode) {
    classes.add('djs-cursor-' + mode);
  }
}

function unset() {
  this.set(null);
}

function has(mode) {
  var classes = domClasses(document.body);

  return classes.has('djs-cursor-' + mode);
}

export default {
  set,
  unset,
  has
};
