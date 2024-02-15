import crypto from "node:crypto";
import fs from "node:fs/promises";
import fsSync from "node:fs";

export default class Service {
  #fileName;
  constructor({ fileName }) {
    this.#fileName = fileName;
  }

  #createHash(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  create({ username, password }) {
    const data = JSON.stringify({
      username,
      password: this.#createHash(password),
      createdAt: new Date().toISOString(),
    }).concat("\n");

    return fs.appendFile(this.#fileName, data);
  }

  async read(id) {
    const fileNotExists = fsSync.existsSync(this.#fileName);
    if (fileNotExists) return [];

    const lines = (await fs.readFile(this.#fileName, "utf-8"))
      .split("\n")
      .filter((file) => !!file);

    if (!lines.length) return [];

    return lines
      .map((line) => JSON.parse(line))
      .map(({ password, ...rest }) => rest);
  }
}
