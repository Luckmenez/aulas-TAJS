import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";
import { server } from "../src/api.js";
/*
  Deve cadastrar usuários e definir categoria onde:
    - 1: jovens adultos: 18 a 25 anos
    - 2: adultos: 26 a 50 anos
    - 3: idosos: +51 anos
    - Menor: Erro!

*/

describe("API  Users E2E Suite", () => {
  let _testServer;
  let _testServerAddress;

  function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once("error", (err) => reject(err));
      server.once("listening", () => resolve());
    });
  }

  function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function findUserById(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`);
    return user.json();
  }

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    _testServer = server.listen();

    await waitForServerStatus(_testServer);

    const serverInfo = _testServer.address();
    _testServerAddress = `http://localhost:${serverInfo.port}`;
  });

  afterAll((done) => {
    server.closeAllConnections();
    _testServer.close(done);
  });

  it("Should create a young adult user", async () => {
    const expectedCategory = "young-adult";
    jest.useFakeTimers({
      now: new Date("2024-02-15T00:00"),
    });
    const response = await createUser({
      name: "Fulano da Silva",
      birthDay: "2000-01-01", // 21 anos
    });

    const result = await response.json();
    const user = await findUserById(result.id);

    expect(response.status).toBe(201);
    expect(result.id).toBeDefined();
    expect(user.category).toBe(expectedCategory);
  });

  it("Should create an adult user", async () => {
    const expectedCategory = "adult";

    jest.useFakeTimers({
      now: new Date("2024-02-15T00:00"),
    });

    const response = await createUser({
      name: "Fulano da Silva",
      birthDay: "1999-01-01", // 26 anos
    });

    const result = await response.json();
    const user = await findUserById(result.id);

    expect(response.status).toBe(201);
    expect(result.id).toBeDefined();
    expect(user.category).toBe(expectedCategory);
  });

  it("Should create an elderly user", async () => {
    const expectedCategory = "elderly";

    jest.useFakeTimers({
      now: new Date("2024-02-15T00:00"),
    });

    const response = await createUser({
      name: "Fulano da Silva",
      birthDay: "1960-01-01", // 64 anos
    });

    const result = await response.json();
    const user = await findUserById(result.id);

    expect(response.status).toBe(201);
    expect(result.id).toBeDefined();
    expect(user.category).toBe(expectedCategory);
  });

  it("Should throw an error with user with invalid age", async () => {
    const response = await createUser({
      name: "Fulano da Silva",
      birthDay: "2018-01-01", // -18 anos
    });
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.message).toBe("User must be 18 years or older");
  });
});
