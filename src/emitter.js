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
      wildCardListener(...args);
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
}

const emitter = new EventEmitter();

// emitter.on("*", (eventName, data) => {
//   console.log(`Wildcard saw: ${eventName} event & data: ${data}`);
// });

// emitter.on("*", (eventName, data) => {
//   console.log(`22222 ---- Wildcard saw: ${eventName} event & data: ${data}`);
// });

// emitter.on("login", (message) => {
//   console.log(`${message}`);
// });

// emitter.on("logout", (message) => {
//   console.log(`${message}`);
// });

// emitter.on("message", (message) => {
//   console.log(`${message}`);
// });

// emitter.emit("login", "login");
// emitter.emit("logout", "logout");
// emitter.emit("message", "message");

emitter.once("hello", (mess) => {
  console.log(`${mess}`);
});

emitter.on("*", (event, data) => {
  console.log("wildcard");
});

emitter.emit("hello");
emitter.emit("hello");

export default EventEmitter;
