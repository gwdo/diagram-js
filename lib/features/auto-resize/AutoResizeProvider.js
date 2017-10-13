'use strict';

import RuleProvider from '../rules/RuleProvider';

/**
 * This is a base rule provider for the element.autoResize rule.
 */
export default class AutoResizeProvider extends RuleProvider {

  constructor(eventBus) {
    super(eventBus);

    this.addRule('element.autoResize', (context) => {
      return this.canResize(context.elements, context.target);
    });
  }

  /**
   * Needs to be implemented by sub classes to allow actual auto resize
   *
   * @param  {Array<djs.model.Shape>} elements
   * @param  {djs.model.Shape} target
   *
   * @return {Boolean}
   */
  canResize(elements, target) {
    return false;
  }
}

AutoResizeProvider.$inject = [ 'eventBus' ];
