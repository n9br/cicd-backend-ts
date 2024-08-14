// const { Sequelize } = require("sequelize");
import { Sequelize } from "sequelize-typescript";

const {
  string: DB_NAME,
  string: DB_USERNAME,
  string: DB_PASSWORD,
  string: DB_HOST,
} = process.env;

console.log("DB_HOST is: " + DB_HOST);
// Connect to MySQL using Sequelize
const todoSequelize = new Sequelize(
  DB_NAME as string,
  DB_USERNAME as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST,
    dialect: "mysql",
    username: DB_USERNAME,
    password: DB_PASSWORD,
  }
);

// console.log(todoSequelize);

// module.exports = todoSequelize;
export default todoSequelize;
