'use strict';

import RuleProvider from '../../../../../lib/features/rules/RuleProvider';

export default class SpaceRules extends RuleProvider {

  init() {
    this.addRule('shape.resize', function(context) {
      return context.shape.children.length > 0;
    });
  }

}

SpaceRules.$inject = [ 'eventBus' ];