class Person {
  static validate(person) {
    if (!person.name) throw new Error("Name is required");
    if (!person.cpf) throw new Error("CPF is required");
  }

  static format(person) {
    const [name, ...lastName] = person.name.split(" ");
    return {
      name,
      lastName: lastName.join(" "),
      cpf: person.cpf.replace(/\D/g, ""),
    };
  }

  static save(person) {
    if (!["cpf", "name", "lastName"].every((prop) => person[prop])) {
      throw new Error(`Cannot save ionvalid person ${JSON.stringify(person)}`);
    }

    console.log("registrado com sucesso", person);
  }

  static process(person) {
    this.validate(person);
    const formattedPerson = this.format(person);
    this.save(formattedPerson);
    return "ok";
  }
}

// Person.process({
//   name: "Mano da Silva",
//   cpf: "123.456.789-00",
// });

export default Person;
