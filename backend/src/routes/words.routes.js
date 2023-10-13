const { Router } = require("express");

const WordsController = require("../controllers/WordsController");

const wordRoutes = Router();

const wordsController = new WordsController();

wordRoutes.get("/", wordsController.index);

module.exports = wordRoutes;
