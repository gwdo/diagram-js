'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');

class ConnectRules extends RuleProvider {

  constructor(eventBus) {
    super(eventBus);
  }

  init() {

    function isSameType(connection, newSource, newTarget) {
      var source = newSource || connection.source,
          target = newTarget || connection.target;

      return source.type === target.type;
    }

    this.addRule('connection.reconnectStart', function(context) {
      return isSameType(context.connection, context.hover);
    });

    this.addRule('connection.updateWaypoints', function(context) {
      return null;
    });

    this.addRule('connection.reconnectEnd', function(context) {
      return isSameType(context.connection, null, context.hover);
    });
  }
}

ConnectRules.$inject = ['eventBus'];

module.exports = ConnectRules;