import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Service from "../src/service.js";
import fs from "node:fs/promises";

describe("#Service Test Suite", () => {
  let _service;
  const fileName = "testfile.ndjson";

  beforeEach(() => {
    _service = new Service({ fileName });
  });

  describe("#Read", () => {
    it("#Should return an empty array if the file is empty", async () => {
      jest.spyOn(fs, fs.readFile.name).mockResolvedValue("");

      const result = await _service.read();
      expect(result).toEqual([]);
    });

    it("#Should return users without password if file contains users", async () => {
      //Arrange
      const dbData = [
        {
          username: "Lucas-Silva",
          password: "StrongPassword",
          createdAt: new Date().toISOString(),
        },
        {
          username: "Lucas-Silva-2",
          password: "StrongPassword2",
          createdAt: new Date().toISOString(),
        },
      ];

      const fileContent = dbData
        .map((item) => JSON.stringify(item).concat("\n"))
        .join("");

      jest.spyOn(fs, "readFile").mockResolvedValue(fileContent);

      //Act
      const result = await _service.read();

      //Assert
      const expected = dbData.map(({ password, ...rest }) => rest);

      expect(result).toEqual(expected);
    });
  });
});
