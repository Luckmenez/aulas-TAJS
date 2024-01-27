import { describe, it, expect, jest } from "@jest/globals";
import Person from "../src/person.js";

describe("#Person Suite", () => {
  describe("#Validate", () => {
    it("should throw when the name is not present", () => {
      const mockInvalidPerson = {
        name: "",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("Name is required")
      );
    });

    it("should throw when the cpf is not present", () => {
      const mockInvalidPerson = {
        name: "Mano do Senhor",
        cpf: "",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("CPF is required")
      );
    });

    it("should not throw when the cpf is not present", () => {
      const mockValidPerson = {
        name: "Mano do Senhor",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockValidPerson)).not.toThrow();
    });
  });

  describe("#Format", () => {
    // parte do princípio que os dados foram validados
    it("should format person name and cpf", () => {
      //Arrange
      const mockPerson = {
        name: "Mano Da Silva",
        cpf: "123.456.789-00",
      };

      //Act
      const formattedPerson = Person.format(mockPerson);

      //Assert
      const expected = {
        name: "Mano",
        lastName: "Da Silva",
        cpf: "12345678900",
      };

      expect(formattedPerson).toStrictEqual(expected);
    });
  });

  describe("#Proccess", () => {
    it("Should process a valid person", () => {
      // Não retestar o que já foi testado.
      // Então não é necessário testar se o validate e o format
      // Estão funcionando ( Checkpoints )
      // Este método faz mais sentido para quando temos interações
      // Externas como chamadas para API e Banco de dados. ( Haverá
      // mais conteudo sobre isso na próxima aula)

      //Arrange
      const mockPerson = {
        name: "Mano da Silva",
        cpf: "123.456.789-00",
      };

      jest.spyOn(Person, Person.validate.name).mockReturnValue();

      jest.spyOn(Person, Person.format.name).mockReturnValue({
        name: "Mano",
        lastName: "da Silva",
        cpf: "12345678900",
      });

      //Act
      const result = Person.process(mockPerson);
      const expected = "ok";
      //Assert
      expect(result).toStrictEqual(expected);
    });
  });
});
