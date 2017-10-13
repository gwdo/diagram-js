'use strict';

import filter from 'lodash/collection/filter';
import forEach from 'lodash/collection/forEach';
import sortBy from 'lodash/collection/sortBy';

function last(arr) {
  return arr && arr[arr.length - 1];
}

function sortTopOrMiddle(element) {
  return element.y;
}

function sortLeftOrCenter(element) {
  return element.x;
}

/**
 * Sorting functions for different types of alignment
 *
 * @type {Object}
 *
 * @return {Function}
 */
var ALIGNMENT_SORTING = {
  left: sortLeftOrCenter,
  center: sortLeftOrCenter,
  right: function(element) {
    return element.x + element.width;
  },
  top: sortTopOrMiddle,
  middle: sortTopOrMiddle,
  bottom: function(element) {
    return element.y + element.height;
  }
};


/**
 * A feature implementing alignment of diagram elements.
 */
export default class AlignElements {

  constructor(modeling) {
    this._modeling = modeling;
  }

  /**
   * Get the relevant "axis" and "dimension" related to the current type of alignment
   *
   * @param  {String} type left|right|center|top|bottom|middle
   *
   * @return {Object} { axis, dimension }
   */
  _getOrientationDetails(type) {
    var vertical = [ 'top', 'bottom', 'middle' ],
        axis = 'x',
        dimension = 'width';

    if (vertical.indexOf(type) !== -1) {
      axis = 'y';
      dimension = 'height';
    }

    return {
      axis: axis,
      dimension: dimension
    };
  }

  _isType(type, types) {
    return types.indexOf(type) !== -1;
  }

  /**
   * Get a point on the relevant axis where elements should align to
   *
   * @param  {String} type left|right|center|top|bottom|middle
   * @param  {Array} sortedElements
   *
   * @return {Object}
   */
  _alignmentPosition(type, sortedElements) {
    var orientation = this._getOrientationDetails(type),
        axis = orientation.axis,
        dimension = orientation.dimension,
        alignment = {},
        centers = {},
        hasSharedCenters = false,
        centeredElements,
        firstElement,
        lastElement;

    function getMiddleOrTop(first, last) {
      return Math.round((first[axis] + last[axis] + last[dimension]) / 2);
    }

    if (this._isType(type, [ 'left', 'top' ])) {
      alignment[type] = sortedElements[0][axis];

    } else if (this._isType(type, [ 'right', 'bottom' ])) {
      lastElement = last(sortedElements);

      alignment[type] = lastElement[axis] + lastElement[dimension];

    } else if (this._isType(type, [ 'center', 'middle' ])) {

      // check if there is a center shared by more than one shape
      // if not, just take the middle of the range
      forEach(sortedElements, function(element) {
        var center = element[axis] + Math.round(element[dimension] / 2);

        if (centers[center]) {
          centers[center].elements.push(element);
        } else {
          centers[center] = {
            elements: [ element ],
            center: center
          };
        }
      });

      centeredElements = sortBy(centers, function(center) {
        if (center.elements.length > 1) {
          hasSharedCenters = true;
        }

        return center.elements.length;
      });

      if (hasSharedCenters) {
        alignment[type] = last(centeredElements).center;

        return alignment;
      }

      firstElement = sortedElements[0];

      sortedElements = sortBy(sortedElements, function(element) {
        return element[axis] + element[dimension];
      });

      lastElement = last(sortedElements);

      alignment[type] = getMiddleOrTop(firstElement, lastElement);
    }

    return alignment;
  }

  /**
   * Executes the alignment of a selection of elements
   *
   * @param  {Array} elements [description]
   * @param  {String} type left|right|center|top|bottom|middle
   */
  trigger(elements, type) {
    var modeling = this._modeling;

    var filteredElements = filter(elements, function(element) {
      return !(element.waypoints || element.host || element.labelTarget);
    });

    var sortFn = ALIGNMENT_SORTING[type];

    var sortedElements = sortBy(filteredElements, sortFn);

    var alignment = this._alignmentPosition(type, sortedElements);

    modeling.alignElements(sortedElements, alignment);
  }
}

AlignElements.$inject = [ 'modeling' ];
