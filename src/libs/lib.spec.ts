import { describe, expect, it } from "vitest";
import { hello } from "./lib";

describe("Lib", () => {
  describe("hello", () => {
    it("should run", async () => {
      expect(hello()).toBe(1);
    });

    it("should boolean", async () => {
      expect(hello() === 1).toBe(true);
    });
  });
});
