'use strict';

import { insertCSS } from './helper';

import BoundsMatchers from './matchers/BoundsMatchers';
import ConnectionMatchers from './matchers/ConnectionMatchers';

export * from './helper';


import fs from 'fs';

insertCSS('diagram-js.css', fs.readFileSync(__dirname + '/../assets/diagram-js.css', 'utf8'));

insertCSS('diagram-js-testing.css',
  '.test-container .result { height: 500px; }' + '.test-container > div'
);


// add suite specific matchers
global.chai.use(BoundsMatchers);
global.chai.use(ConnectionMatchers);
