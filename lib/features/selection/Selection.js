'use strict';

import isArray from 'lodash/lang/isArray';
import forEach from 'lodash/collection/forEach';


/**
 * A service that offers the current selection in a diagram.
 * Offers the api to control the selection, too.
 *
 * @param {EventBus} eventBus the event bus
 */
export default class Selection {

  constructor(eventBus) {

    this._eventBus = eventBus;

    this._selectedElements = [];

    var self = this;

    eventBus.on([ 'shape.remove', 'connection.remove' ], function(e) {
      var element = e.element;
      self.deselect(element);
    });

    eventBus.on([ 'diagram.clear' ], function(e) {
      self.select(null);
    });
  }

  deselect(element) {
    var selectedElements = this._selectedElements;

    var idx = selectedElements.indexOf(element);

    if (idx !== -1) {
      var oldSelection = selectedElements.slice();

      selectedElements.splice(idx, 1);

      this._eventBus.fire('selection.changed', { oldSelection: oldSelection, newSelection: selectedElements });
    }
  }

  get() {
    return this._selectedElements;
  }

  isSelected(element) {
    return this._selectedElements.indexOf(element) !== -1;
  }

  /**
   * This method selects one or more elements on the diagram.
   *
   * By passing an additional add parameter you can decide whether or not the element(s)
   * should be added to the already existing selection or not.
   *
   * @method Selection#select
   *
   * @param  {Object|Object[]} elements element or array of elements to be selected
   * @param  {boolean} [add] whether the element(s) should be appended to the current selection, defaults to false
   */
  select(elements, add) {
    var selectedElements = this._selectedElements,
        oldSelection = selectedElements.slice();

    if (!isArray(elements)) {
      elements = elements ? [ elements ] : [];
    }

    // selection may be cleared by passing an empty array or null
    // to the method
    if (add) {
      forEach(elements, function(element) {
        if (selectedElements.indexOf(element) !== -1) {
          // already selected
          return;
        } else {
          selectedElements.push(element);
        }
      });
    } else {
      this._selectedElements = selectedElements = elements.slice();
    }

    this._eventBus.fire('selection.changed', {
      oldSelection: oldSelection,
      newSelection: selectedElements
    });
  }
}

Selection.$inject = [ 'eventBus' ];
