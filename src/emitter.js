import { eventError, listenerError } from "./util.js";

class EventEmitter {
  constructor() {
    this.event = {};
  }

  on(event, listener) {
    if (typeof event !== "string") {
      throw new Error(eventError);
    }

    if (typeof listener !== "function") {
      throw new Error(listenerError);
    }

    if (!this.event[event]) {
      this.event[event] = [];
    }

    this.event[event].push(listener);
  }

  emit(event, ...args) {
    if (!this.event[event]) {
      return;
    }

    if (args.length === 0) {
      throw new Error("No arguments added");
    }

    for (const listener of this.event[event]) {
      listener(...args);
    }
  }

  off(event, listener) {
    if (!this.event[event]) {
      return;
    }

    if (typeof listener !== "function") {
      throw new Error(listenerError);
    }

    const remainingListeners = this.event[event].filter((func) => {
      // console.log({ func, listener, bool: func === listener });
      return func !== listener;
    });

    this.event[event] = remainingListeners;
  }

  once(event, listener) {
    if (typeof event !== "string") {
      throw new Error(eventError);
    }

    if (typeof listener !== "function") {
      throw new Error(listenerError);
    }

    const wrapper = (...args) => {
      listener(...args);

      this.off(event, wrapper);
    };

    this.on(event, wrapper);
  }
}

const emit = new EventEmitter();

emit.once("mess", (mess) => {
  console.log(`${mess}`);
});
emit.emit("mess", "alexis maca needs to go!!!!");
emit.emit("mess", "call again !!!");

export default EventEmitter;
