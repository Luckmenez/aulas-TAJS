import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Task from "../src/task.js";
import { setTimeout } from "node:timers/promises";

describe("#Task Test Suite", () => {
  let _logMock;
  let _task;

  beforeEach(() => {
    _logMock = jest.spyOn(console, console.log.name).mockImplementation();

    _task = new Task();
  });

  it.skip("#Should be able to only run tasks where due without fake timers (slow)", async () => {
    // Arrange
    const tasks = [
      {
        name: "task1",
        dueAt: new Date(Date.now() + 5000), //5s
        fn: jest.fn(),
      },
      {
        name: "task2",
        dueAt: new Date(Date.now() + 10000), //10s
        fn: jest.fn(),
      },
    ];

    // Act
    _task.save(tasks[0]);
    _task.save(tasks[1]);

    _task.run(200);

    await setTimeout(11e3); //11s

    expect(tasks[0].fn).toHaveBeenCalled();
    expect(tasks[1].fn).toHaveBeenCalled();
  }, 15e3); // Configuração para o jest esperar 15s para rodar

  it("#Should be able to only run tasks where due with fake timers (fast)", async () => {
    jest.useFakeTimers();
    // Arrange
    const tasks = [
      {
        name: "task1",
        dueAt: new Date(Date.now() + 5000), //5s
        fn: jest.fn(),
      },
      {
        name: "task2",
        dueAt: new Date(Date.now() + 10000), //10s
        fn: jest.fn(),
      },
    ];

    // Act
    _task.save(tasks[0]);
    _task.save(tasks[1]);

    _task.run(200);

    jest.advanceTimersByTime(4000); //4s

    expect(tasks[0].fn).not.toHaveBeenCalled();
    expect(tasks[1].fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000); //2s + 4s = 6s

    expect(tasks[0].fn).toHaveBeenCalled();
    expect(tasks[1].fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(6000); // 6s + 6s = 12s

    expect(tasks[0].fn).toHaveBeenCalled();
    expect(tasks[1].fn).toHaveBeenCalled();
  });
});
