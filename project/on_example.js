class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    const listeners = this.events[event];
    if (!listeners) return;
    for (const listener of listeners) {
      listener(...args);
    }
  }
}

const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log(`Hello ${name}`);
});

emitter.on("message", (message) => {
  console.log(`message`);
});

emitter.emit("message", "message from the terminal");
emitter.emit("greet", "Alex");

const emitter = new EventEmitter();

emitter.on("*", (eventName, data) => {
  console.log(`Wildcard saw: ${eventName} event & data: ${data}`);
});

emitter.on("*", (eventName, data) => {
  console.log(`22222 ---- Wildcard saw: ${eventName} event & data: ${data}`);
});

emitter.on("login", (message) => {
  console.log(`${message}`);
});

emitter.on("logout", (message) => {
  console.log(`${message}`);
});

emitter.on("message", (message) => {
  console.log(`${message}`);
});

emitter.emit("login", "login");
emitter.emit("logout", "logout");
emitter.emit("message", "message");

emitter.once("hello", (mess) => {
  console.log(`${mess}`);
});

emitter.on("*", (event, data) => {
  console.log("wildcard");
});

emitter.emit("hello");
emitter.emit("hello");

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

emitter.on("task", async () => {
  console.log("Starting task A");

  await wait(1000);

  console.log("Finished task A");
});

emitter.on("task", async () => {
  console.log("Starting task B");

  await wait(500);

  console.log("Finished task B");
});

console.log("Before emitAsync");

await emitter.emitAsync("task");

console.log("After emitAsync");
