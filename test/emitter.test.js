import EventEmitter from "../src/emitter.js";
import { eventError, listenerError } from "../src/util.js";

describe("EventEmitter", () => {
  describe("on", () => {
    it("should store the event and listeners in a object and array", () => {
      const emit = new EventEmitter();

      emit.on("message", () => {});
      emit.on("message", () => {});
      emit.on("send", () => {});

      expect(emit.event.message.length).toEqual(2);
      expect(emit.event.send.length).toEqual(1);
    });

    it("should return error when the event is not a string", () => {
      const emit = new EventEmitter();

      expect(() => {
        emit.on(123, () => {});
      }).toThrow(eventError);
    });

    it("should return an error when the listener is not a function", () => {
      const emit = new EventEmitter();

      expect(() => {
        emit.on("message", 123);
      }).toThrow("Listener must be a function");
    });
  });

  describe("emit", () => {
    it("should return values when a emit listener is called", () => {
      const emitter = new EventEmitter();

      let receivedMessage = "";

      emitter.on("message", (message) => {
        receivedMessage = message;
      });

      emitter.emit("message", "Hello World");

      expect(receivedMessage).toBe("Hello World");
    });

    it("should execute a listener with the multiple correct values when an event is emitted", () => {
      const emitter = new EventEmitter();
      let receivedMessage = "";

      emitter.on("message", (message) => {
        receivedMessage = message;
      });

      emitter.emit("message", [
        "string",
        123,
        { foo: "bar" },
        ["hello", "world"],
      ]);

      expect(receivedMessage).toEqual([
        "string",
        123,
        { foo: "bar" },
        ["hello", "world"],
      ]);
    });

    it("should not execute listener and throw an error when event does not exist", () => {
      const emitter = new EventEmitter();

      expect(() => {
        emitter.emit("message", () => {});
      }).not.toThrow();
    });
  });

  describe("off", () => {
    it("should remove a listener from an event", () => {
      const emit = new EventEmitter();

      const func = () => {};

      emit.on("message", func);

      expect(emit.event.message.length).toEqual(1);

      emit.off("message", func);

      expect(emit.event.message.length).toEqual(0);
    });

    it("should remove a listener from an event with multiple listeners", () => {
      const emit = new EventEmitter();

      const func = () => {};
      const func2 = () => {};

      emit.on("message", func);
      emit.on("message", func2);

      expect(emit.event.message.length).toEqual(2);

      emit.off("message", func);

      expect(emit.event.message.length).toEqual(1);
    });

    it("should return if event does not exist", () => {
      const emit = new EventEmitter();

      expect(() => {
        emit.off("hello");
      }).not.toThrow();
    });

    it("should throw an error when listener is not passed", () => {
      const emit = new EventEmitter();

      emit.on("hello", () => {});

      expect(() => {
        emit.off("hello");
      }).toThrow("The second argument to .off() must be a function listener.");
    });
  });

  describe("once", () => {
    it("should emit event and remove the listener", () => {
      const emit = new EventEmitter();

      const func = () => {};

      emit.once("message", func);

      emit.emit("message", () => {});

      expect(emit.event.message.length).toEqual(0);
    });

    it("should emit event once", () => {
      const emit = new EventEmitter();

      let count = 0;

      const counter = (num) => {
        console.log(num, "num");

        count = count + num;
      };

      emit.once("message", counter);

      emit.emit("message", 1);
      emit.emit("message", 1);
      emit.emit("message", 1);
      emit.emit("message", 1);

      expect(count).toEqual(1);
    });

    it("should return error when the event is not a string", () => {
      const emit = new EventEmitter();

      expect(() => {
        emit.once(123, () => {});
      }).toThrow(eventError);
    });
  });
});
