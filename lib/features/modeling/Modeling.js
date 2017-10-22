'use strict';

import { forEach } from 'min-dash/lib/collection';

import { Base } from '../../model';

import AppendShapeHandler from './cmd/AppendShapeHandler';
import CreateShapeHandler from './cmd/CreateShapeHandler';
import DeleteShapeHandler from './cmd/DeleteShapeHandler';
import MoveShapeHandler from './cmd/MoveShapeHandler';
import ResizeShapeHandler from './cmd/ResizeShapeHandler';
import ReplaceShapeHandler from './cmd/ReplaceShapeHandler';
import ToggleShapeCollapseHandler from './cmd/ToggleShapeCollapseHandler';
import SpaceToolHandler from './cmd/SpaceToolHandler';
import CreateLabelHandler from './cmd/CreateLabelHandler';
import CreateConnectionHandler from './cmd/CreateConnectionHandler';
import DeleteConnectionHandler from './cmd/DeleteConnectionHandler';
import MoveConnectionHandler from './cmd/MoveConnectionHandler';
import LayoutConnectionHandler from './cmd/LayoutConnectionHandler';
import UpdateWaypointsHandler from './cmd/UpdateWaypointsHandler';
import ReconnectConnectionHandler from './cmd/ReconnectConnectionHandler';
import MoveElementsHandler from './cmd/MoveElementsHandler';
import DeleteElementsHandler from './cmd/DeleteElementsHandler';
import DistributeElementsHandler from './cmd/DistributeElementsHandler';
import AlignElementsHandler from './cmd/AlignElementsHandler';
import UpdateAttachmentHandler from './cmd/UpdateAttachmentHandler';
import PasteHandler from './cmd/PasteHandler';

/**
 * The basic modeling entry point.
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 */
export default class Modeling {

  constructor(eventBus, elementFactory, commandStack) {
    this._eventBus = eventBus;
    this._elementFactory = elementFactory;
    this._commandStack = commandStack;

    var self = this;

    eventBus.on('diagram.init', function() {
      // register modeling handlers
      self.registerHandlers(commandStack);
    });
  }

  getHandlers() {
    return {
      'shape.append': AppendShapeHandler,
      'shape.create': CreateShapeHandler,
      'shape.delete': DeleteShapeHandler,
      'shape.move': MoveShapeHandler,
      'shape.resize': ResizeShapeHandler,
      'shape.replace': ReplaceShapeHandler,
      'shape.toggleCollapse': ToggleShapeCollapseHandler,

      'spaceTool': SpaceToolHandler,

      'label.create': CreateLabelHandler,

      'connection.create': CreateConnectionHandler,
      'connection.delete': DeleteConnectionHandler,
      'connection.move': MoveConnectionHandler,
      'connection.layout': LayoutConnectionHandler,

      'connection.updateWaypoints': UpdateWaypointsHandler,

      'connection.reconnectStart': ReconnectConnectionHandler,
      'connection.reconnectEnd': ReconnectConnectionHandler,

      'elements.move': MoveElementsHandler,
      'elements.delete': DeleteElementsHandler,

      'elements.distribute': DistributeElementsHandler,
      'elements.align': AlignElementsHandler,

      'element.updateAttachment': UpdateAttachmentHandler,

      'elements.paste': PasteHandler
    };
  }

  /**
   * Register handlers with the command stack
   *
   * @param {CommandStack} commandStack
   */
  registerHandlers(commandStack) {
    forEach(this.getHandlers(), function(handler, id) {
      commandStack.registerHandler(id, handler);
    });
  }

  ///// modeling helpers /////////////////////////////////////////

  moveShape(shape, delta, newParent, newParentIndex, hints) {

    if (typeof newParentIndex === 'object') {
      hints = newParentIndex;
      newParentIndex = null;
    }

    var context = {
      shape: shape,
      delta:  delta,
      newParent: newParent,
      newParentIndex: newParentIndex,
      hints: hints || {}
    };

    this._commandStack.execute('shape.move', context);
  }

  /**
   * Update the attachment of the given shape.
   *
   * @param  {djs.mode.Base} shape
   * @param  {djs.model.Base} [newHost]
   */
  updateAttachment(shape, newHost) {
    var context = {
      shape: shape,
      newHost: newHost
    };

    this._commandStack.execute('element.updateAttachment', context);
  }

  /**
   * Move a number of shapes to a new target, either setting it as
   * the new parent or attaching it.
   *
   * @param {Array<djs.mode.Base>} shapes
   * @param {Point} delta
   * @param {djs.model.Base} [target]
   * @param {Boolean} [isAttach=false]
   * @param {Object} [hints]
   */
  moveElements(shapes, delta, target, isAttach, hints) {
    if (typeof isAttach === 'object') {
      hints = isAttach;
      isAttach = undefined;
    }

    var newParent = target,
        newHost;

    if (isAttach === true) {
      newHost = target;
      newParent = target.parent;
    }

    if (isAttach === false) {
      newHost = null;
    }

    var context = {
      shapes: shapes,
      delta: delta,
      newParent: newParent,
      newHost: newHost,
      hints: hints || {}
    };

    this._commandStack.execute('elements.move', context);
  }

  moveConnection(connection, delta, newParent, newParentIndex, hints) {

    if (typeof newParentIndex === 'object') {
      hints = newParentIndex;
      newParentIndex = undefined;
    }

    var context = {
      connection: connection,
      delta: delta,
      newParent: newParent,
      newParentIndex: newParentIndex,
      hints: hints || {}
    };

    this._commandStack.execute('connection.move', context);
  }

  layoutConnection(connection, hints) {
    var context = {
      connection: connection,
      hints: hints || {}
    };

    this._commandStack.execute('connection.layout', context);
  }

  /**
   * Create connection.
   *
   * @param {djs.model.Base} source
   * @param {djs.model.Base} target
   * @param {Number} [targetIndex]
   * @param {Object|djs.model.Connection} connection
   * @param {djs.model.Base} parent
   * @param {Object} hints
   *
   * @return {djs.model.Connection} the created connection.
   */
  createConnection(source, target, parentIndex, connection, parent, hints) {

    if (typeof parentIndex === 'object') {
      hints = parent;
      parent = connection;
      connection = parentIndex;
      parentIndex = undefined;
    }

    connection = this._create('connection', connection);

    var context = {
      source: source,
      target: target,
      parent: parent,
      parentIndex: parentIndex,
      connection: connection,
      hints: hints
    };

    this._commandStack.execute('connection.create', context);

    return context.connection;
  }

  createShape(shape, position, parent, parentIndex, isAttach, hints) {

    if (typeof parentIndex !== 'number') {
      hints = isAttach;
      isAttach = parentIndex;
    }

    if (typeof isAttach !== 'boolean') {
      hints = isAttach;
      isAttach = false;
    }

    shape = this._create('shape', shape);

    var context = {
      position: position,
      shape: shape,
      parent: parent,
      parentIndex: parentIndex,
      host: shape.host,
      hints: hints || {}
    };

    if (isAttach) {
      context.parent = parent.parent;
      context.host = parent;
    }

    this._commandStack.execute('shape.create', context);

    return context.shape;
  }

  createLabel(labelTarget, position, label, parent) {

    label = this._create('label', label);

    var context = {
      labelTarget: labelTarget,
      position: position,
      parent: parent || labelTarget.parent,
      shape: label
    };

    this._commandStack.execute('label.create', context);

    return context.shape;
  }

  appendShape(source, shape, position, parent, connection, connectionParent) {

    shape = this._create('shape', shape);

    var context = {
      source: source,
      position: position,
      parent: parent,
      shape: shape,
      connection: connection,
      connectionParent: connectionParent
    };

    this._commandStack.execute('shape.append', context);

    return context.shape;
  }

  removeElements(elements) {
    var context = {
      elements: elements
    };

    this._commandStack.execute('elements.delete', context);
  }

  distributeElements(groups, axis, dimension) {
    var context = {
      groups: groups,
      axis: axis,
      dimension: dimension
    };

    this._commandStack.execute('elements.distribute', context);
  }

  removeShape(shape, hints) {
    var context = {
      shape: shape,
      hints: hints || {}
    };

    this._commandStack.execute('shape.delete', context);
  }

  removeConnection(connection, hints) {
    var context = {
      connection: connection,
      hints: hints || {}
    };

    this._commandStack.execute('connection.delete', context);
  }

  replaceShape(oldShape, newShape, hints) {
    var context = {
      oldShape: oldShape,
      newData: newShape,
      hints: hints || {}
    };

    this._commandStack.execute('shape.replace', context);

    return context.newShape;
  }

  pasteElements(tree, topParent, position) {
    var context = {
      tree: tree,
      topParent: topParent,
      position: position
    };

    this._commandStack.execute('elements.paste', context);
  }

  alignElements(elements, alignment) {
    var context = {
      elements: elements,
      alignment: alignment
    };

    this._commandStack.execute('elements.align', context);
  }

  resizeShape(shape, newBounds, minBounds) {
    var context = {
      shape: shape,
      newBounds: newBounds,
      minBounds: minBounds
    };

    this._commandStack.execute('shape.resize', context);
  }

  createSpace(movingShapes, resizingShapes, delta, direction) {
    var context = {
      movingShapes: movingShapes,
      resizingShapes: resizingShapes,
      delta: delta,
      direction: direction
    };

    this._commandStack.execute('spaceTool', context);
  }

  updateWaypoints(connection, newWaypoints, hints) {
    var context = {
      connection: connection,
      newWaypoints: newWaypoints,
      hints: hints || {}
    };

    this._commandStack.execute('connection.updateWaypoints', context);
  }

  reconnectStart(connection, newSource, dockingOrPoints) {
    var context = {
      connection: connection,
      newSource: newSource,
      dockingOrPoints: dockingOrPoints
    };

    this._commandStack.execute('connection.reconnectStart', context);
  }

  reconnectEnd(connection, newTarget, dockingOrPoints) {
    var context = {
      connection: connection,
      newTarget: newTarget,
      dockingOrPoints: dockingOrPoints
    };

    this._commandStack.execute('connection.reconnectEnd', context);
  }

  connect(source, target, attrs, hints) {
    return this.createConnection(source, target, attrs || {}, source.parent, hints);
  }

  _create(type, attrs) {
    if (attrs instanceof Base) {
      return attrs;
    } else {
      return this._elementFactory.create(type, attrs);
    }
  }

  toggleCollapse(shape, hints) {
    var context = {
      shape: shape,
      hints: hints || {}
    };

    this._commandStack.execute('shape.toggleCollapse', context);
  }
}

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack' ];
