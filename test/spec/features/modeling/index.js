import CoreModule from '../../../../lib/core';
import CommandModule from '../../../../lib/cmd';

import Modeling from '../../../../lib/features/modeling/Modeling';

export default {
  __depends__: [
    CoreModule,
    CommandModule
  ],
  modeling: [ 'type', Modeling ]
};
