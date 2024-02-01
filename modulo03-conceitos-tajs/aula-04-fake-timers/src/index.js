import Task from "./task.js";

const oneSecond = 1000;
const runInOneSecond = new Date(Date.now() + oneSecond);
const runInTwoSeconds = new Date(runInOneSecond.getTime() + oneSecond * 2);
const runInThreeSeconds = new Date(runInOneSecond.getTime() + oneSecond * 3);

const task = new Task();

task.save({
  name: "Send email to John",
  dueAt: runInOneSecond,
  fn: () => console.log("Sending email to John"),
});

task.save({
  name: "Send email to Bob",
  dueAt: runInTwoSeconds,
  fn: () => console.log("Sending email to Bob"),
});

task.save({
  name: "Send email to Alice",
  dueAt: runInThreeSeconds,
  fn: () => console.log("Sending email to Alice"),
});

task.run(oneSecond);
