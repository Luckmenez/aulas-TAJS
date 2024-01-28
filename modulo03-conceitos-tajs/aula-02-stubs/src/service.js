import crypto from "node:crypto";
import fs from "node:fs/promises";

export default class Service {
  #fileName;
  constructor({ fileName }) {
    this.#fileName = fileName;
  }

  #createHash(password) {
    const hash = crypto.createHash("sha256");
    hash.update(password);

    return hash.digest("hex");
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
    const lines = (await fs.readFile(this.#fileName, "utf-8"))
      .split("\n")
      .filter((file) => !!file);

    if (!lines.length) return [];

    return lines
      .map((line) => JSON.parse(line))
      .map(({ password, ...rest }) => rest);
  }
}
