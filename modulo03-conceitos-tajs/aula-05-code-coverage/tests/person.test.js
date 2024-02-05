import { describe, it, jest, expect, beforeEach } from "@jest/globals";
import { mapPerson } from "../src/person.js";

describe("#Person Test Suite", () => {
  describe("#Happy path", () => {
    it("#It should be able to read an user from a string", () => {
      const personStr = '{"name":"someone da silva","age":28}';
      const personObj = mapPerson(personStr);

      expect(personObj).toEqual({
        name: "someone da silva",
        age: 28,
        createdAt: expect.any(Date),
      });
    });
  });

  describe("#What coverage doesn't tell you", () => {
    it("#should not read a person with a invalid string", () => {
      const personStr = '{"name"';

      expect(() => mapPerson(personStr)).toThrowError();
    });

    it("should not read a person with invalid arguments", () => {
      const personStr = "{}";
      const personObj = mapPerson(personStr);

      expect(personObj).toEqual({
        name: undefined,
        age: undefined,
        createdAt: expect.any(Date),
      });
    });
  });
});
