// Example Usage

const EventEmitter = require("../src/emitter");

const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log(`Hello ${name}`);
});

emitter.emit("greet", "Alex");

// Output:

// Hello Alex
