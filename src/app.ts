import express from "express";
import compression from "compression";
import bodyParser from "body-parser";

// Controllers (route handlers)
import * as userController from "./controllers/user";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 8000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */
app.post("/login", userController.validateLogin, userController.postLogin);
app.post("/signup", userController.postSignup);

export default app;
