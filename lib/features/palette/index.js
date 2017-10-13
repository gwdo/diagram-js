import ToolManagerModule from '../tool-manager';
import Palette from './Palette';

export default {
  __depends__: [ ToolManagerModule ],
  __init__: [ 'palette' ],
  palette: [ 'type', Palette ]
};
