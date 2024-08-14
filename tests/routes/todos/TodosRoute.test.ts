import request from "supertest";
import app from "../../../src/server";
import TodoModel from "../../../src/database/models/TodoModel";
import { ReasonPhrases } from "http-status-codes";

describe("GET /v1/todos/all", () => {
  test("Test /all todos route", async () => {
    const response = await request(app)
      .get("/v1/todos/all")
      .expect("Content-Type", /json/)
      .expect(200);

    const myTodos: any[] = response.body;
    const myFirstTodo = myTodos[0];

    expect(myTodos.length).toBeGreaterThan(0);
    expect(myFirstTodo.id).toBeDefined();
    expect(myFirstTodo.task).toBeDefined();
    expect(myFirstTodo.userId).toBeDefined();
  });

  test("GET by Id", async () => {
    const todoId = 1;
    const response = await request(app)
      .get(`/v1/todos/byid`)
      .query({ todoId: todoId })
      .expect("Content-Type", /json/)
      .expect(200);

    const myTodo = response.body.todo;
    expect(myTodo.id).toEqual(todoId);
  });

  test("GET by User Id with missing query", async () => {
    const response = await request(app)
      .get(`/v1/todos/byid`)
      .query({})
      .expect(400);

    expect(response.text).toEqual(ReasonPhrases.BAD_REQUEST);
  });

  test("GET by User Id", async () => {
    const userId = 1;
    const response = await request(app)
      .get(`/v1/todos/byuserid`)
      .query({ userId })
      .expect("Content-Type", /json/)
      .expect(200);

    const myTodos: any[] = response.body.todos;
    const myFirstTodo = myTodos[0];

    expect(myTodos.length).toBeGreaterThan(0);
    expect(myFirstTodo.id).toBeDefined();
    expect(myFirstTodo.task).toBeDefined();
    expect(myFirstTodo.userId).toBeDefined();
  });

  test("GET by User Id with missing query", async () => {
    const response = await request(app)
      .get(`/v1/todos/byuserid`)
      .query({})
      .expect(400);

    expect(response.text).toEqual(`${ReasonPhrases.BAD_REQUEST} Keine userID`);
  });
});

describe("Test Mutations (PUT, POST, DELETE)", () => {
  test("Test Create Object", async () => {
    await request(app)
      .post(`/v1/todos/create`)
      .send({
        newTask: "Tennis spielen",
        newIsDone: false,
        newDueDate: "2026-10-10",
        newUserId: 2,
      })
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("Test Update Object", async () => {
    const response = await request(app)
      .put(`/v1/todos/update`)
      .send({
        newTask: "Putzen",
        newIsDone: false,
        newDueDate: "2026-10-10",
        todoId: 1,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const updatedTodoId: number = response.body.updatedTodoId;
    expect(updatedTodoId).toBe(1);

    // Query the updated todo directly from the database
    const updatedTodo = await TodoModel.findOne({ where: { id: 1 } });
    // Compare the updated todo with the new value
    expect(updatedTodo?.task).toEqual("Putzen");
    expect(updatedTodo?.isDone).toEqual(false);
    expect(updatedTodo?.dueDate).toEqual(new Date("2026-10-10"));
  });

  test("Test Mark Object as not done", async () => {
    const response = await request(app)
      .put(`/v1/todos/mark`)
      .send({
        todoId: 1,
        newIsDone: false,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const updatedTodoId: number = response.body.updatedTodoId;
    expect(updatedTodoId).toBe(1);

    // Query the todo directly from the database
    const updatedTodo = await TodoModel.findOne({ where: { id: 1 } });
    expect(updatedTodo?.isDone).toEqual(false);
  });

  test("Test Mark Object with missing data", async () => {
    await request(app).put(`/v1/todos/mark`).send({}).expect(400);
  });

  test("Test Mark Object as done", async () => {
    const response = await request(app)
      .put(`/v1/todos/mark`)
      .send({
        todoId: 1,
        newIsDone: true,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const updatedTodoId: number = response.body.updatedTodoId;
    expect(updatedTodoId).toBe(1);

    // Query the todo directly from the database
    const updatedTodo = await TodoModel.findOne({ where: { id: 1 } });
    expect(updatedTodo?.isDone).toEqual(true);
  });

  test("Test Delete Object", async () => {
    const response = await request(app)
      .delete(`/v1/todos/delete`)
      .send({
        todoId: 2,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const deletedTodosId: number = response.body.deletedTodosId;
    expect(deletedTodosId).toBe(2);

    // Query the todo directly from the database
    const deletedTodo = await TodoModel.findOne({ where: { id: 2 } });
    expect(deletedTodo).toBeNull();
  });
});
