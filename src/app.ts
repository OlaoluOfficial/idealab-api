import "dotenv/config";
import express, { json, urlencoded } from "express";
import crudRoute from "./controller/crud";
import authRoute from "./controller/user.auth";
import db from "./data/db";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(json(), urlencoded({ extended: true }));

//Confirm database connection
// Alter will modify the table if it already exists
// Force will drop the table if it already exists
db.sync({
  alter: true,
})
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.error("Database connection failed:", error));

app.get("/", (_, res) => res.json({ msg: "Welcome to the API" }));
app.use("/api/v1", authRoute);
app.use("/api/v1/crud", crudRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
