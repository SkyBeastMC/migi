"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModuleData = getModuleData;
exports.isModule = isModule;
exports.getListenerData = getListenerData;
exports.default = exports.LISTENER_DATA = exports.MODULE_DATA = void 0;

var _discord = require("discord.js");

const MODULE_DATA = Symbol('module_data');
exports.MODULE_DATA = MODULE_DATA;
const LISTENER_DATA = Symbol('listener_data');
exports.LISTENER_DATA = LISTENER_DATA;
const MIGI_DATA = Symbol('migi_data');

function getModuleData(module) {
  return (typeof module === 'function' ? module : module.constructor)[MODULE_DATA];
}

function isModule(instance) {
  return !!(instance.constructor && instance.constructor[MODULE_DATA]);
}

function getListenerData(handler) {
  return handler[LISTENER_DATA];
}

class Migi extends _discord.Client {
  constructor({
    discordOptions,
    root = process.cwd()
  } = {}) {
    super(discordOptions);
    this.root = root;
    this._modules = [];
  }

  loadModule(ModuleConstructor) {
    // public module data
    ModuleConstructor[MODULE_DATA] = {
      [MIGI_DATA]: {
        listeners: [],
        instance: null
      },

      get listeners() {
        return Object.freeze(this[MIGI_DATA].listeners.slice());
      },

      get instance() {
        return this[MIGI_DATA].instance;
      },

      get name() {
        return ModuleConstructor.name;
      }

    };
    const moduleInstance = new ModuleConstructor(this);
    ModuleConstructor[MODULE_DATA].instance = moduleInstance;

    this._modules.push(moduleInstance);

    this.emit('moduleLoad', ModuleConstructor, moduleInstance);
    return moduleInstance;
  }

  unloadModule(module) {
    if (!isModule(module) || !this.isModuleLoaded(module)) throw new Error('instance must a loaded module instance');
    getModuleData(module)[MIGI_DATA].instance = null;
    this.emit('moduleUnload', module);

    this._modules.remove(module);
  }

  listen(module, event, listener) {
    if (!isModule(module) || !this.isModuleLoaded(module)) throw new Error('module must be a loaded module instance');
    if (typeof event !== 'string') throw new Error('event must be a string');
    if (typeof listener !== 'function') throw new Error('listener must be a function'); // public handler data

    listener[LISTENER_DATA] = {
      get module() {
        return module;
      },

      get event() {
        return event;
      }

    };
    this.removeListener;
    getModuleData(module)[MIGI_DATA].listeners.push(listener);
    this.emit('listenerAdd', listener);
    this.on(event, listener);
  }

  isModuleLoaded(module) {
    if (!isModule(module)) throw new Error('module must be a module instance');
    return !!getModuleData(module).instance;
  }

}

exports.default = Migi;