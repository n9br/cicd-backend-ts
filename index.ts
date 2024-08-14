import todoSequelize from "./src/database/setup/database";
import app from "./src/server";

// Access to environment variables
// const PORT: string | undefined = process.env.PORT;
const envPort = parseInt(process.env.PORT || "");
const PORT = Number.isInteger(envPort) ? envPort : 5050;

console.log("Port No is: " + PORT);
// console.log("DB-Host is: " + DB)

todoSequelize
  .sync()
  .then(() => {
    console.log("DB has been successfully initialized");
  })
  .catch((e: Error) => {
    console.log(e);
  });

// App listens on the port defined by the environment variable
if (PORT) {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
} else {
  console.error("PORT is not defined");
}
