import { it, expect } from "@jest/globals";

function sum(a, b) {
  return a + b;
}

it("should be able to sum 2 values", () => {
  expect(sum(2, 3)).toBe(5);
});
