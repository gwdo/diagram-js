'use strict';

/**
 * A clip board stub
 */
class Clipboard {

  get() {
    return this._data;
  }

  set(data) {
    this._data = data;
  }

  clear() {
    var data = this._data;

    delete this._data;

    return data;
  }

  isEmpty() {
    return !this._data;
  }
}

module.exports = Clipboard;