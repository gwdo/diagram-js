'use strict';

var MARKER_OK = 'connect-ok',
    MARKER_NOT_OK = 'connect-not-ok';


export default class GlobalConnect {

  constructor(eventBus, dragging, connect, canvas, toolManager) {
    var self = this;

    this._dragging = dragging;

    toolManager.registerTool('global-connect', {
      tool: 'global-connect',
      dragging: 'global-connect.drag'
    });

    eventBus.on('global-connect.hover', function(event) {
      var context = event.context,
          startTarget = event.hover;

      var canStartConnect = context.canStartConnect = self.canStartConnect(startTarget);

      // simply ignore hover
      if (canStartConnect === null) {
        return;
      }

      context.startTarget = startTarget;

      canvas.addMarker(startTarget, canStartConnect ? MARKER_OK : MARKER_NOT_OK);
    });


    eventBus.on([ 'global-connect.out', 'global-connect.cleanup' ], function(event) {
      var startTarget = event.context.startTarget,
          canStartConnect = event.context.canStartConnect;

      if (startTarget) {
        canvas.removeMarker(startTarget, canStartConnect ? MARKER_OK : MARKER_NOT_OK);
      }
    });


    eventBus.on([ 'global-connect.ended' ], function(event) {
      var context = event.context,
          startTarget = context.startTarget,
          startPosition = {
            x: event.x,
            y: event.y
          };

      var canStartConnect = self.canStartConnect(startTarget);

      if (!canStartConnect) {
        return;
      }

      eventBus.once('element.out', function() {
        eventBus.once([ 'connect.ended', 'connect.canceled' ], function() {
          eventBus.fire('global-connect.drag.ended');
        });

        connect.start(null, startTarget, startPosition);
      });

      return false;
    });
  }

  /**
   * Initiates tool activity.
   */
  start(event) {
    this._dragging.init(event, 'global-connect', {
      trapClick: false,
      data: {
        context: {}
      }
    });
  }

  toggle() {
    if (this.isActive()) {
      this._dragging.cancel();
    } else {
      this.start();
    }
  }

  isActive() {
    var context = this._dragging.context();

    return context && /^global-connect/.test(context.prefix);
  }

  registerProvider(provider) {
    this._provider = provider;
  }

  /**
   * Check if source shape can initiate connection.
   *
   * @param  {Shape} startTarget
   * @return {Boolean}
   */
  canStartConnect(startTarget) {
    return this._provider.canStartConnect(startTarget);
  }
}

GlobalConnect.$inject = [
  'eventBus',
  'dragging',
  'connect',
  'canvas',
  'toolManager'
];
