'use strict';

import RuleProvider from '../../../../../lib/features/rules/RuleProvider';

export default class ConnectRules extends RuleProvider {

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
