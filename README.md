# tiny-emitter-js

A lightweight, production-style `EventEmitter` library inspired by Node.js core events.

## Features

- Small, zero-dependency event emitter
- Supports `on`, `off`, `once`, and `emit`
- Supports wildcard listeners via `*`
- Supports asynchronous listeners with `emitAsync`
- Designed for modern ESM workflows

## Installation

```bash
npm install tiny-emitter
```

## Usage

```js
import EventEmitter from "tiny-emitter";

const emitter = new EventEmitter();

function onMessage(data) {
  console.log("message received:", data);
}

emitter.on("message", onMessage);
emitter.emit("message", "Hello World");
```

## API

### `new EventEmitter()`

Create a new emitter instance.

### `emitter.on(event, listener)`

Register a listener for the specified event.

- `event` must be a string
- `listener` must be a function

### `emitter.emit(event, ...args)`

Synchronously invoke all listeners for the event.

### `emitter.off(event, listener)`

Remove a listener for the specified event.

### `emitter.once(event, listener)`

Register a listener that will run only once and then remove itself.

### `emitter.emitAsync(event, ...args)`

Invoke listeners sequentially and await each one if it returns a promise.

## Wildcard listeners

Register a wildcard listener using the event name `"*"` to receive every emitted event.

```js
emitter.on("*", (event, payload) => {
  console.log(`event ${event} emitted with`, payload);
});

emitter.emit("login", { user: "alice" });
```

## Example

```js
import EventEmitter from "tiny-emitter";

const emitter = new EventEmitter();

emitter.on("login", (user) => {
  console.log("Logged in:", user);
});

emitter.once("welcome", () => {
  console.log("Welcome event fired once");
});

emitter.emit("login", "alice");
emitter.emit("welcome");
emitter.emit("welcome");
```

## Tests

Run the test suite with:

```bash
npm test
```

## License

ISC
