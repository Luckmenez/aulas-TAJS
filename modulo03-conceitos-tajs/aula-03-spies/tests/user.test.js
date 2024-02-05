import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Service from "../src/service.js";
import fs from "node:fs/promises";
import crypto from "node:crypto";

describe("#Service Test Suite", () => {
  let _service;
  const fileName = "testfile.ndjson";
  const MOCKED_VALUE_PWD = "HASHED_PWD";
  describe("#Create - Spies", () => {
    beforeEach(() => {
      jest.spyOn(crypto, crypto.createHash.name).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(MOCKED_VALUE_PWD),
      });

      jest.spyOn(fs, fs.appendFile.name).mockResolvedValue();
      _service = new Service({ fileName });
    });

    it("should call appendFiles with right params", async () => {
      // Arrange
      const expectedCreatedAt = new Date().toISOString();

      const input = {
        username: "test",
        password: "test",
      };

      jest
        .spyOn(Date.prototype, Date.prototype.toISOString.name)
        .mockReturnValue(expectedCreatedAt);

      // Act
      const result = await _service.create(input);

      // Assert
      expect(crypto.createHash).toHaveBeenCalledTimes(1);
      expect(crypto.createHash).toHaveBeenCalledWith("sha256");
      expect(crypto.createHash("sha256").update).toHaveBeenCalledWith(
        input.password
      );
      expect(
        crypto.createHash("sha256").update(input.password).digest
      ).toHaveBeenCalledWith("hex");

      const expected = JSON.stringify({
        ...input,
        password: MOCKED_VALUE_PWD,
        createdAt: expectedCreatedAt,
      }).concat("\n");

      expect(fs.appendFile).toHaveBeenCalledTimes(1);
      expect(fs.appendFile).toHaveBeenCalledWith(fileName, expected);
    });
  });
});
