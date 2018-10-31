"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isModule = isModule;
exports.getMigiData = getMigiData;
exports.default = void 0;

var _discord = require("discord.js");

const MIGI_DATA = Symbol('migi');

function isModule(instance) {
  return !!(instance.constructor && instance.constructor[MIGI_DATA]);
}

function getMigiData(obj) {
  return obj[MIGI_DATA];
}

class Migi extends _discord.Client {
  constructor({
    discordOptions,
    root = process.cwd()
  } = {}) {
    super(discordOptions);
    this._root = root;
    this._modules = [];
  }

  get root() {
    return this._root;
  }

  loadModule(ModuleConstructor) {
    const migi = this; // init module data

    const data = {
      _listeners: [],
      _instance: null,
      _loading: true,

      get listeners() {
        return Object.freeze(this._listeners.slice());
      },

      get instance() {
        return this._instance;
      },

      get loaded() {
        return !!this._instance;
      },

      get name() {
        return ModuleConstructor.name;
      },

      get migi() {
        return migi;
      }

    };
    ModuleConstructor[MIGI_DATA] = data;
    const module = new ModuleConstructor(this);
    data._loading = false;
    data._instance = module; // add module

    this._modules.push(module);

    this.emit('moduleLoad', module);
    return module;
  }

  unloadModule(module) {
    if (!isModule(module) || !this.isModuleLoaded(module)) throw new Error('instance must a loaded module instance');
    const data = module.constructor[MIGI_DATA];
    data._instance = null; // set unloaded
    // remove listeners

    data._listeners.forEach(listener => {
      const _listener$MIGI_DATA = listener[MIGI_DATA],
            event = _listener$MIGI_DATA.event,
            _rawHandler = _listener$MIGI_DATA._rawHandler;
      this.emit('listenerRemove', module, event, listener);
      this.removeListener(event, _rawHandler);
    }); // remove module


    this.emit('moduleUnload', module);

    this._modules.splice(this._modules.indexOf(module), 1);
  }

  listen(module, event, listener) {
    if (!isModule(module)) throw new Error('module must be a module instance');
    if (typeof event !== 'string') throw new Error('event must be a string');
    if (typeof listener !== 'function') throw new Error('listener must be a function'); // allow adding in constructor

    const data = module.constructor[MIGI_DATA];
    if (!data._loading && !data._instance) throw new Error('module must be a currently loading or loaded module instance'); // init listener data

    const listData = {
      _rawHandler: (...args) => listener.apply(module, args),

      // fix `this` arg
      get module() {
        return module;
      },

      get event() {
        return event;
      },

      get handler() {
        return listener;
      }

    };
    listener[MIGI_DATA] = listData; // add listener

    data._listeners.push(listener);

    this.emit('listenerAdd', module, event, listener);
    this.on(event, listData._rawHandler);
  }

  isModuleLoaded(module) {
    if (!isModule(module)) throw new Error('module must be a module instance');
    return !!module.constructor[MIGI_DATA].instance;
  }

}

exports.default = Migi;