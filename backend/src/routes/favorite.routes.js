const { Router } = require("express");

const FavoriteController = require("../controllers/FavoriteController");

const favoriteController = new FavoriteController();

const favoriteRoutes = Router();

favoriteRoutes.post("/", favoriteController.updateWordFavorite);
favoriteRoutes.get("/", favoriteController.listFavorites);
module.exports = favoriteRoutes;
