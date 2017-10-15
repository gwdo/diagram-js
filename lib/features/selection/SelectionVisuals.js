'use strict';

import forEach from 'lodash-es/forEach';

var MARKER_HOVER = 'hover',
    MARKER_SELECTED = 'selected';


/**
 * A plugin that adds a visible selection UI to shapes and connections
 * by appending the <code>hover</code> and <code>selected</code> classes to them.
 *
 * It adds the selection interaction, too.
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 * @param {Selection} selection
 * @param {Styles} styles
 */
export default class SelectionVisuals {

  constructor(eventBus, canvas, selection, styles) {

    this._multiSelectionBox = null;

    function addMarker(e, cls) {
      canvas.addMarker(e, cls);
    }

    function removeMarker(e, cls) {
      canvas.removeMarker(e, cls);
    }

    eventBus.on('element.hover', function(event) {
      addMarker(event.element, MARKER_HOVER);
    });

    eventBus.on('element.out', function(event) {
      removeMarker(event.element, MARKER_HOVER);
    });

    eventBus.on('selection.changed', function(event) {

      function deselect(s) {
        removeMarker(s, MARKER_SELECTED);
      }

      function select(s) {
        addMarker(s, MARKER_SELECTED);
      }

      var oldSelection = event.oldSelection,
          newSelection = event.newSelection;

      forEach(oldSelection, function(e) {
        if (newSelection.indexOf(e) === -1) {
          deselect(e);
        }
      });

      forEach(newSelection, function(e) {
        if (oldSelection.indexOf(e) === -1) {
          select(e);
        }
      });
    });
  }
}

SelectionVisuals.$inject = [
  'eventBus',
  'canvas',
  'selection',
  'styles'
];
