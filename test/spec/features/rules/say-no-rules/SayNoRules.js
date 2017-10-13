'use strict';

import RuleProvider from '../../../../../lib/features/rules/RuleProvider';


export default class SayNoRules extends RuleProvider {

  init() {

    this.addRule('shape.resize', function(context) {
      return false;
    });
  }
}

SayNoRules.$inject = [ 'eventBus' ];
