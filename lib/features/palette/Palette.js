'use strict';

import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';

import domify from 'min-dom/lib/domify';
import domQuery from 'min-dom/lib/query';
import domAttr from 'min-dom/lib/attr';
import domClear from 'min-dom/lib/clear';
import domClasses from 'min-dom/lib/classes';
import domMatches from 'min-dom/lib/matches';
import domDelegate from 'min-dom/lib/delegate';
import domEvent from 'min-dom/lib/event';


var toggleSelector = '.djs-palette-toggle',
    entrySelector = '.entry',
    elementSelector = toggleSelector + ', ' + entrySelector;


/**
 * A palette containing modeling elements.
 */
export default class Palette {

  constructor(eventBus, canvas, dragging) {

    this._eventBus = eventBus;
    this._canvas = canvas;
    this._dragging = dragging;

    this._providers = [];

    var self = this;

    eventBus.on('tool-manager.update', function(event) {
      var tool = event.tool;

      self.updateToolHighlight(tool);
    });

    eventBus.on('i18n.changed', function() {
      self._update();
    });
  }

  /**
   * Register a provider with the palette
   *
   * @param  {PaletteProvider} provider
   */
  registerProvider(provider) {
    this._providers.push(provider);

    if (!this._container) {
      this._init();
    }

    this._update();
  }

  /**
   * Returns the palette entries for a given element
   *
   * @return {Array<PaletteEntryDescriptor>} list of entries
   */
  getEntries() {

    var entries = {};

    // loop through all providers and their entries.
    // group entries by id so that overriding an entry is possible
    forEach(this._providers, function(provider) {
      var e = provider.getPaletteEntries();

      forEach(e, function(entry, id) {
        entries[id] = entry;
      });
    });

    return entries;
  }

  /**
   * Initialize
   */
  _init() {
    var canvas = this._canvas,
        eventBus = this._eventBus;

    var parent = canvas.getContainer(),
        container = this._container = domify(Palette.HTML_MARKUP),
        self = this;

    parent.appendChild(container);

    domDelegate.bind(container, elementSelector, 'click', function(event) {

      var target = event.delegateTarget;

      if (domMatches(target, toggleSelector)) {
        return self.toggle();
      }

      self.trigger('click', event);
    });

    // prevent drag propagation
    domEvent.bind(container, 'mousedown', function(event) {
      event.stopPropagation();
    });

    // prevent drag propagation
    domDelegate.bind(container, entrySelector, 'dragstart', function(event) {
      self.trigger('dragstart', event);
    });

    eventBus.fire('palette.create', {
      html: container
    });

    eventBus.on('canvas.resized', this.triggerTwoColumn, this);
  }

  _update() {

    var entriesContainer = domQuery('.djs-palette-entries', this._container),
        entries = this._entries = this.getEntries();

    domClear(entriesContainer);

    forEach(entries, function(entry, id) {

      var grouping = entry.group || 'default';

      var container = domQuery('[data-group=' + grouping + ']', entriesContainer);
      if (!container) {
        container = domify('<div class="group" data-group="' + grouping + '"></div>');
        entriesContainer.appendChild(container);
      }

      var html = entry.html || (
        entry.separator ?
          '<hr class="separator" />' :
          '<div class="entry" draggable="true"></div>');


      var control = domify(html);
      container.appendChild(control);

      if (!entry.separator) {
        domAttr(control, 'data-action', id);

        if (entry.title) {
          domAttr(control, 'title', entry.title);
        }

        if (entry.className) {
          addClasses(control, entry.className);
        }

        if (entry.imageUrl) {
          control.appendChild(domify('<img src="' + entry.imageUrl + '">'));
        }
      }
    });

    // open after update
    this.open(true);
  }

  /**
   * Trigger an action available on the palette
   *
   * @param  {String} action
   * @param  {Event} event
   */
  trigger(action, event, autoActivate) {
    var entries = this._entries,
        entry,
        handler,
        originalEvent,
        button = event.delegateTarget || event.target;

    if (!button) {
      return event.preventDefault();
    }

    entry = entries[domAttr(button, 'data-action')];

    // when user clicks on the palette and not on an action
    if (!entry) {
      return;
    }

    handler = entry.action;

    originalEvent = event.originalEvent || event;

    // simple action (via callback function)
    if (isFunction(handler)) {
      if (action === 'click') {
        handler(originalEvent, autoActivate);
      }
    } else {
      if (handler[action]) {
        handler[action](originalEvent, autoActivate);
      }
    }

    // silence other actions
    event.preventDefault();
  }

  triggerTwoColumn() {
    var canvas = this._canvas;

    var parent = canvas.getContainer();

    if (parent.clientHeight < 650) {
      domClasses(parent).add('two-column');
    } else {
      domClasses(parent).remove('two-column');
    }
  }

  /**
   * Close the palette
   */
  close() {
    var canvas = this._canvas;

    var parent = canvas.getContainer();

    domClasses(this._container).remove('open');

    domClasses(parent).remove('two-column');
  }

  /**
   * Open the palette
   */
  open() {
    domClasses(this._container).add('open');

    this.triggerTwoColumn();
  }

  toggle(open) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  isActiveTool(tool) {
    return tool && this._activeTool === tool;
  }

  updateToolHighlight(name) {
    var entriesContainer,
        toolsContainer;

    if (!this._toolsContainer) {
      entriesContainer = domQuery('.djs-palette-entries', this._container);

      this._toolsContainer = domQuery('[data-group=tools]', entriesContainer);
    }

    toolsContainer = this._toolsContainer;

    forEach(toolsContainer.children, function(tool) {
      var actionName = tool.getAttribute('data-action');

      if (!actionName) {
        return;
      }

      actionName = actionName.replace('-tool', '');

      if (tool.classList.contains('entry') && actionName === name) {
        domClasses(tool).add('highlighted-entry');
      } else {
        domClasses(tool).remove('highlighted-entry');
      }
    });
  }

  /**
   * Return true if the palette is opened.
   *
   * @example
   *
   * palette.open();
   *
   * if (palette.isOpen()) {
   *   // yes, we are open
   * }
   *
   * @return {boolean} true if palette is opened
   */
  isOpen() {
    return this._container && domClasses(this._container).has('open');
  }
}

Palette.$inject = [
  'eventBus',
  'canvas',
  'dragging'
];


/* markup definition */

Palette.HTML_MARKUP =
  '<div class="djs-palette">' +
    '<div class="djs-palette-entries"></div>' +
    '<div class="djs-palette-toggle"></div>' +
  '</div>';


////////// helpers /////////////////////////////

function addClasses(element, classNames) {

  var classes = domClasses(element);

  var actualClassNames = isArray(classNames) ? classNames : classNames.split(/\s+/g);
  actualClassNames.forEach(function(cls) {
    classes.add(cls);
  });
}
