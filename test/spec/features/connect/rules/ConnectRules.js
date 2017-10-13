'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');

class ConnectRules extends RuleProvider {

  init() {

    this.addRule('connection.create', function(context) {
      var source = context.source,
          target = context.target;

      if (source && target && source.parent === target.parent) {
        return { type: 'test:Connection' };
      }

      return false;
    });
  }
}

ConnectRules.$inject = ['eventBus'];

module.exports = ConnectRules;
