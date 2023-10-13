const { Router } = require("express");

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");

const wordsRouter = require("./words.routes");
const favoriteRouter = require("./favorite.routes");
const historyRouter = require("./history.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/words", wordsRouter);
routes.use("/favorite", favoriteRouter);
routes.use("/history", historyRouter);

module.exports = routes;
