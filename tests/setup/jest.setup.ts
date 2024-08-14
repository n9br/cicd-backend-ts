import "../../src/server";
import TodoModel from "../../src/database/models/TodoModel";
import todoSequelize from "../../src/database/setup/database";
import TestDataTodos from "./test-data/TestDataTodos";

export default async () => {
  try {
    // Uncomment if you need to drop and sync the schema for testing
    // await todoSequelize.dropSchema("Todos").then(() => {
    //   todoSequelize.sync();
    // });

    console.log("Environment Variables:", process.env);

    await todoSequelize.dropSchema("Todos");
    await todoSequelize.sync();

    // Fill the database with data to prepare it for test scenarios
    await TodoModel.bulkCreate(TestDataTodos);
  } catch (e) {
    console.error("Database Issue:", e);
  }
};
