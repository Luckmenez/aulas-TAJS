import { BeforeStep, Then, When } from "@cucumber/cucumber";
import assert from "node:assert";

let _testServerAddress = "";
let _context = {};

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

BeforeStep(function () {
  this.testServerAddress;
  if (_testServerAddress) return;
  _testServerAddress = this.testServerAddress;
});

When(
  `I create a new user with the following details:`,
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 201);
    _context.userData = await response.json();
    assert.ok(_context.userData.id);
  }
);

Then(`I request the API with the user's ID`, async function () {
  const user = await findUserById(_context.userData.id);
  _context.createdUserData = user;
});

Then(
  `I should receive a JSON response with the user's details`,
  async function () {
    const expectedKeys = ["name", "birthDay", "id", "category"];
    assert.deepStrictEqual(
      Object.keys(_context.createdUserData).sort(),
      expectedKeys.sort()
    );
  }
);

Then(`The user's category should be {string}`, async function (category) {
  assert.strictEqual(_context.createdUserData.category, category);
});

When(
  `I create a new user with the following details 5:`,
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 400);
    _context.error = await response.json();
  }
);

Then(
  `I should receive an error message that the birth date is invalid`,
  function () {
    assert.strictEqual(
      _context.error.message,
      "User must be 18 years or older"
    );
  }
);

When(
  `I create a young user with the following details:`,
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 400);
    _context.userData2 = await response.json();
  }
);

Then(
  `I should receive an error message that the user must be at least 18 years old`,
  async function () {
    assert.strictEqual(
      _context.userData2.message,
      "User must be 18 years or older"
    );
  }
);

When(
  `I create a new user with the following details 2:`,
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 201);
    _context.user3 = await response.json();
    assert.ok(_context.user3.id);
  }
);

Then(`the category should be {string}`, async function (category) {
  const user = await findUserById(_context.user3.id);
  assert.equal(user.category, category);
});

When("I request the user with ID", async function () {
  const user = await findUserById(_context.user3.id);
  _context.foundUser1 = user;
  assert.ok(user.id);
});

Then("the user's category should be {string}", function (category) {
  assert.equal(_context.foundUser1.category, category);
});

When(
  `I create a new user with the following details 4:`,
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 500);
    _context.user4 = await response.text();
  }
);

Then(
  "I should receive an error message that the name cannot be empty",
  function () {
    assert.strictEqual(_context.user4, "Fatal Error");
  }
);

When(
  `I create a new user with the following details 3:`,
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 201);
    _context.user5 = await response.json();
    assert.ok(_context.user5.id);
  }
);

When("I request the user with ID 3", async function () {
  console.log(_context.user5.id);
  const user = await findUserById(_context.user5.id);
  assert.ok(user.id);
});

Then("the user should be categorized as a {string}", async function (string) {
  const user = await findUserById(_context.user5.id);
  assert.equal(user.category, string);
});
