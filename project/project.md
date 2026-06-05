# Project: Build a Custom Event Emitter (JavaScript)

## Project Goal

Create a lightweight, production-style EventEmitter library inspired by Node.js core events.

The project focuses on:

- Event-driven programming
- Software architecture
- API design
- Memory management concepts
- Async programming
- Clean JavaScript patterns
- Testing and debugging

By the end of this project, you should understand:

- How event systems work internally
- How libraries expose APIs
- How callbacks/listeners work
- How asynchronous execution behaves
- How to structure maintainable JavaScript projects

---

# Inspiration

Inspired by:

- Node.js EventEmitter
- Observer Pattern
- Pub/Sub Systems
- Browser DOM Events

---

# Main Concepts You Will Learn

## 1. Observer Pattern

The Observer Pattern allows objects to subscribe to events and react when those events occur.

Example:

```js
button.onClick(() => {
  console.log("Button clicked");
});
```

Your emitter will work similarly.

---

## 2. Event-Driven Architecture

Instead of directly calling functions everywhere, parts of the application communicate through events.

Example:

```js
emitter.emit("user:login");
```

Other parts of the app can react independently.

---

## 3. Closures and Function References

Listeners are stored as function references.

Example:

```js
function greet() {
  console.log("Hello");
}

emitter.on("welcome", greet);
```

You’ll learn:

- Functions as values
- Callback patterns
- Function storage/removal

---

## 4. Async JavaScript

Some listeners may be asynchronous.

Example:

```js
emitter.on("save", async () => {
  await database.save();
});
```

You’ll implement async event support.

---

## 5. Memory Management

You’ll learn why unused listeners can create memory leaks.

Stretch concepts:

- WeakMap
- WeakRef
- Garbage collection awareness

---

# Core Features

---

# 1. `.on(event, listener)`

Registers a listener.

Example:

```js
emitter.on("message", (data) => {
  console.log(data);
});
```

## What it should do

- Store listeners
- Allow multiple listeners per event
- Preserve execution order

---

# 2. `.emit(event, ...args)`

Triggers all listeners for an event.

Example:

```js
emitter.emit("message", "Hello World");
```

Expected output:

```txt
Hello World
```

---

# 3. `.off(event, listener)`

Removes a listener.

Example:

```js
function greet() {
  console.log("hi");
}

emitter.on("hello", greet);

emitter.off("hello", greet);
```

---

# 4. `.once(event, listener)`

Listener runs only once.

Example:

```js
emitter.once("startup", () => {
  console.log("Started");
});
```

After first emit:

```js
emitter.emit("startup");
```

Second emit should do nothing.

---

# 5. Wildcard Listeners

Listen to ALL events.

Example:

```js
emitter.on("*", (eventName, data) => {
  console.log(eventName, data);
});
```

Useful for:

- Logging
- Analytics
- Debugging

---

# 6. Async Event Support

Support async listeners.

Example:

```js
emitter.on("save", async () => {
  await wait(1000);
  console.log("Saved");
});

await emitter.emitAsync("save");
```

---

# Stretch Goals

These are optional but excellent for improving your skills.

---

# Stretch Goal 1: Event Namespaces

Example:

```js
"user:create";
"user:update";
"user:delete";
```

Possible feature:

```js
emitter.emitNamespace("user");
```

Triggers all `user:*` events.

---

# Stretch Goal 2: Priority Listeners

Higher-priority listeners run first.

Example:

```js
emitter.on("data", handler, { priority: 10 });
```

---

# Stretch Goal 3: Error Boundary Events

Prevent one broken listener from crashing all others.

Example:

```js
emitter.on("error", (err) => {
  console.error(err);
});
```

---

# Stretch Goal 4: Weak References

Advanced memory management.

Learn:

- WeakMap
- WeakRef
- FinalizationRegistry

These help avoid memory leaks.

---

# Recommended Folder Structure

```txt
event-emitter-project/
│
├── src/
│   ├── emitter.js
│   ├── utils.js
│   └── index.js
│
├── tests/
│   └── emitter.test.js
│
├── examples/
│   └── basic-example.js
│
├── package.json
├── README.md
└── .gitignore
```

---

# Suggested Development Phases

## Phase 1 — Basic Emitter

Build:

- on
- emit

Focus on:

- Arrays
- Objects
- Looping
- Function calls

---

## Phase 2 — Listener Removal

Add:

- off

Focus on:

- Array filtering
- Equality comparisons
- Function references

---

## Phase 3 — Once Listeners

Add:

- once

Focus on:

- Wrapper functions
- Closures

---

## Phase 4 — Async Support

Add:

- emitAsync

Focus on:

- async/await
- Promise.all

---

## Phase 5 — Advanced Features

Add:

- wildcard listeners
- namespaces
- priorities
- error handling

---

# Example Starter Code

## emitter.js

```js
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

module.exports = EventEmitter;
```

---

# Example Usage

## basic-example.js

```js
const EventEmitter = require("../src/emitter");

const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log(`Hello ${name}`);
});

emitter.emit("greet", "Alex");
```

Output:

```txt
Hello Alex
```

---

# Important Coding Notations & Conventions

---

# 1. Use Clear Naming

BAD:

```js
fn();
```

GOOD:

```js
handleUserLogin();
```

---

# 2. Keep Functions Small

A function should ideally do ONE thing.

BAD:

```js
function processEverything() {}
```

GOOD:

```js
function validateInput() {}
function saveUser() {}
function sendNotification() {}
```

---

# 3. Avoid Deep Nesting

BAD:

```js
if (a) {
  if (b) {
    if (c) {
    }
  }
}
```

GOOD:

```js
if (!a) return;
if (!b) return;
if (!c) return;
```

---

# 4. Write Defensive Code

Example:

```js
if (!Array.isArray(listeners)) {
  return;
}
```

---

# 5. Prefer `const`

Use:

```js
const
```

Unless reassignment is required.

---

# 6. Comment WHY, Not WHAT

BAD:

```js
// Increment i
i++;
```

GOOD:

```js
// Move to next listener in execution queue
i++;
```

---

# Testing Recommendations

Use:

- Jest
- Vitest
- Node test runner

Example test:

```js
test("emit calls listener", () => {
  const emitter = new EventEmitter();

  let called = false;

  emitter.on("ping", () => {
    called = true;
  });

  emitter.emit("ping");

  expect(called).toBe(true);
});
```

---

# Recommended NPM Packages

## Testing

```bash
npm install --save-dev jest
```

---

# Useful Commands

## Initialize project

```bash
npm init -y
```

## Run tests

```bash
npm test
```

---

# Skills You Will Improve

By completing this project you’ll improve:

## JavaScript Fundamentals

- Objects
- Arrays
- Closures
- Classes
- Modules

## Software Design

- API design
- Encapsulation
- Reusability

## Debugging

- Stack traces
- Event flow tracking
- Async debugging

## Engineering Thinking

- Edge cases
- Scalability
- Performance

---

# Common Problems You’ll Face

These are GOOD learning opportunities.

## Duplicate listeners

Should duplicates be allowed?

---

## Removing wrapped once listeners

How do you remove internally wrapped functions?

---

## Async error handling

What happens if a listener throws?

---

## Event ordering

Should listeners execute in insertion order?

---

# Final Challenge Ideas

After the base project works:

## Build:

- Chat room event system
- Multiplayer game events
- Mini frontend framework events
- Plugin system
- WebSocket event layer

---

# Estimated Time

## Beginner

4–7 days

## Intermediate

2–3 days

## Advanced (with stretch goals)

1–2 weeks

---

# Recommended Learning Resources

## Official References

- MDN JavaScript Docs
- Node.js Events API

## Topics to Study Alongside

- Closures
- Prototypes
- Event loop
- Promises
- Garbage collection

---

# Suggested Final Goal

Turn this into a reusable npm package.

Possible package name:

```txt
tiny-emitter-js
```

Then:

- Publish to npm
- Add documentation
- Add benchmarks
- Add TypeScript typings later

That final step teaches real-world library engineering.

---
