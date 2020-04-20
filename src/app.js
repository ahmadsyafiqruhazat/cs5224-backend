import express, { json, urlencoded } from "express";
import logger from "morgan";
import _database from "./models";

import userRouteHandler from "./routes/user";
import eventRouteHandler from "./routes/events";

const port = parseInt(process.env.PORT, 10) || 3000;

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger("dev"));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/profile", userRouteHandler);
app.use("/event", eventRouteHandler);

//module.exports = app;
app.listen(port);
