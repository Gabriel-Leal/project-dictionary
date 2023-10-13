const { Router } = require("express");

const HistoryController = require("../controllers/HistoryController");

const historyController = new HistoryController();

const historyRoutes = Router();

historyRoutes.post("/", historyController.addWordToHistory);

historyRoutes.get("/", historyController.getAllWords);

module.exports = historyRoutes;
