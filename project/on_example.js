// class EventEmitter {
//   constructor() {
//     this.events = {};
//   }

//   on(event, listener) {
//     if (!this.events[event]) {
//       this.events[event] = [];
//     }
//     this.events[event].push(listener);
//   }

//   emit(event, ...args) {
//     const listeners = this.events[event];
//     if (!listeners) return;
//     for (const listener of listeners) {
//       listener(...args);
//     }
//   }
// }

// export default EventEmitter;

// const emitter = new EventEmitter();

// emitter.on("greet", (name) => {
//   console.log(`Hello ${name}`);
// });

// emitter.on("message", (message) => {
//   console.log(`message`);
// });

// emitter.emit("message", "message from the terminal");
// emitter.emit("greet", "Alex");
