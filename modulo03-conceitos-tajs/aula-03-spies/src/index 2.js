import Service from "./service.js";

const data = {
  username: `Lucas-Silva-${Date.now()}`,
  password: "StrongPassword",
};

const service = new Service({
  fileName: "./users.ndjson",
});

await service.create(data);

const users = await service.read();
