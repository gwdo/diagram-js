'use strict';

/**
 * Util that provides unique IDs.
 *
 * @class djs.util.IdGenerator
 * @constructor
 * @memberOf djs.util
 *
 * The ids can be customized via a given prefix and contain a random value to avoid collisions.
 */
export default class IdGenerator {

  /**
   * Creates the generator with the given prefix
   *
   * @param {String} prefix to prepend to generated ids
   */
  constructor(prefix) {

    this._counter = 0;
    this._prefix = (prefix ? prefix + '-' : '') + Math.floor(Math.random() * 1000000000) + '-';
  }

 /**
  * Returns a next unique ID.
  *
  * @method djs.util.IdGenerator#next
  *
  * @returns {String} the id
  */
  next() {
    return this._prefix + (++this._counter);
  }

}
