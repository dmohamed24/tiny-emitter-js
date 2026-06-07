class EventEmitter {
  constructor() {
    this.event = {};
  }

  on(event, listener) {
    if (typeof event !== "string") {
      throw new Error("Event must be a string - .on");
    }

    if (typeof listener !== "function") {
      throw new Error("Listener must be a function - .on");
    }

    if (!this.event[event]) {
      this.event[event] = [];
    }

    this.event[event].push(listener);
  }

  emit(event, ...args) {
    const listeners = this.event[event] || [];

    const wildListeners = this.event["*"] || [];

    const listenersCopy = [...listeners];
    const wildCardsListener = [...wildListeners];

    for (const listener of listenersCopy) {
      listener(...args);
    }

    for (const wildCardListener of wildCardsListener) {
      wildCardListener(event, ...args);
    }
  }

  off(event, listener) {
    if (!this.event[event]) {
      return;
    }

    if (typeof listener !== "function") {
      throw new Error(
        ` "The second argument to .off() must be a function listener.",`,
      );
    }

    const remainingListeners = this.event[event].filter(
      (func) => func !== listener,
    );

    this.event[event] = remainingListeners;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);

      this.off(event, wrapper);
    };

    this.on(event, wrapper);
  }

  async emitAsync(event, ...args) {
    const listeners = this.event[event] || [];
    const wildCardListeners = this.event["*"] || [];

    const listenersCopy = [...listeners];
    const wildCardListenersCopy = [...wildCardListeners];

    for (const listener of listenersCopy) {
      await listener(...args);
    }

    for (const wildCardListener of wildCardListenersCopy) {
      await wildCardListener(event, ...args);
    }
  }
}

export default EventEmitter;

// note
// parallel execution, if listener a takes 10s and listener b takes 1s do you need to wait ?
// If You Ever Want Parallel Async Execution
// You’d eventually evolve toward something conceptually like:
// run all listeners simultaneously
// wait for all to finish
// instead of:
// wait one-by-one
