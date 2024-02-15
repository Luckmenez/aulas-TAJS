import { once } from "node:events";
import { createServer } from "node:http";
import Person from "./person.js";

const server = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/persons") {
    response.writeHead(404);
    response.end("Wrong call");
    return;
  }

  try {
    const data = (await once(request, "data")).toString();
    const result = Person.process(JSON.parse(data));
    return response.end(JSON.stringify(result));
  } catch (error) {
    if (error.message.includes("required")) {
      response.writeHead(400);
      response.write(
        JSON.stringify({
          validationError: error.message,
        })
      );
      response.end();
      return;
    }
    console.error("Error: ", error);
    response.writeHead(500);
    response.end("Internal server error");
  }
});

export default server;

/*
  curl -i POST \
  -H 'Content-Type: application/json' \
  -d '{"name": "John Doe" , "cpf":"425.425.425-42"}' \
  http://localhost:3000/persons
*/
