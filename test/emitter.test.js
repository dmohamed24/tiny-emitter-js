import EventEmitter from "../src/emitter.js";
import { eventError, listenerError } from "../src/util.js";
import { expect, jest } from "@jest/globals";

describe("EventEmitter", () => {
  let emit;

  beforeEach(() => {
    emit = new EventEmitter();
    emit.event = {};
  });

  describe("on", () => {
    it("should store the event and listeners in a object and array", () => {
      emit.on("message", () => {});
      emit.on("message", () => {});
      emit.on("send", () => {});

      expect(emit.event.message.length).toEqual(2);
      expect(emit.event.send.length).toEqual(1);
    });

    it("should return error when the event is not a string", () => {
      expect(() => {
        emit.on(123, () => {});
      }).toThrow(eventError);
    });

    it("should return an error when the listener is not a function", () => {
      expect(() => {
        emit.on("message", 123);
      }).toThrow("Listener must be a function");
    });
  });

  describe("emit", () => {
    it("should return values when a emit listener is called", () => {
      let receivedMessage = "";

      emit.on("message", (message) => {
        receivedMessage = message;
      });

      emit.emit("message", "Hello World");

      expect(receivedMessage).toBe("Hello World");
    });

    it("should return values when a emit listener & wildcards listener exists", () => {
      let receivedMessage = "";

      let wildCardMessage = "";

      emit.on("message", (message) => {
        receivedMessage = message;
      });

      emit.on("*", (eventName, data) => {
        wildCardMessage = `${eventName} - ${data}`;
      });

      emit.emit("message", "Hello world");

      expect(receivedMessage).toBe("Hello world");
      expect(wildCardMessage).toBe("message - Hello world");
    });

    it("should execute a listener with the multiple correct values when an event is emitted", () => {
      let receivedMessage = "";

      emit.on("message", (message) => {
        receivedMessage = message;
      });

      emit.emit("message", ["string", 123, { foo: "bar" }, ["hello", "world"]]);

      expect(receivedMessage).toEqual([
        "string",
        123,
        { foo: "bar" },
        ["hello", "world"],
      ]);
    });

    it("should not execute listener and throw an error when event does not exist", () => {
      expect(() => {
        emit.emit("message", () => {});
      }).not.toThrow();
    });
  });

  describe("off", () => {
    it("should remove a listener from an event", () => {
      const func = () => {};

      emit.on("message", func);

      expect(emit.event.message.length).toEqual(1);

      emit.off("message", func);

      expect(emit.event.message.length).toEqual(0);
    });

    it("should remove a listener from an event with multiple listeners", () => {
      const func = () => {};
      const func2 = () => {};

      emit.on("message", func);
      emit.on("message", func2);

      expect(emit.event.message.length).toEqual(2);

      emit.off("message", func);

      expect(emit.event.message.length).toEqual(1);
    });

    it("should return if event does not exist", () => {
      expect(() => {
        emit.off("hello");
      }).not.toThrow();
    });

    it("should throw an error when listener is not passed", () => {
      emit.on("hello", () => {});

      expect(() => {
        emit.off("hello");
      }).toThrow("The second argument to .off() must be a function listener.");
    });
  });

  describe("once", () => {
    it("should emit event and remove the listener", () => {
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
      expect(() => {
        emit.once(123, () => {});
      }).toThrow(eventError);
    });
  });

  describe("asyncEmit", () => {
    it("should execute all standard listeners with arguments", async () => {
      const mockListener1 = jest.fn().mockResolvedValue("res1");
      const mockListener2 = jest.fn().mockResolvedValue("res2");

      emit.event["message"] = [mockListener1, mockListener2];

      await emit.emitAsync("message", "Hello World");

      expect(mockListener1).toHaveBeenCalledWith("Hello World");
      expect(mockListener2).toHaveBeenCalledWith("Hello World");
    });

    it("should execute any wildcard listeners with arguments", async () => {
      const mockListener1 = jest.fn().mockResolvedValue("");
      const wildCardMockListener1 = jest.fn().mockResolvedValue("");

      emit.event["*"] = [wildCardMockListener1];
      emit.event["message"] = [mockListener1];

      await emit.emitAsync("message", "Hello World");

      expect(wildCardMockListener1).toHaveBeenCalledWith(
        "message",
        "Hello World",
      );
    });

    it("should not execute listener and throw an error", async () => {
      const mockListener1 = jest.fn().mockResolvedValue("ok");
      const mockListener2 = jest.fn().mockRejectedValue(new Error("Timeout"));

      emit.event["message"] = [mockListener1, mockListener2];

      await expect(emit.emitAsync("message")).rejects.toThrow("Timeout");
    });
  });
});
