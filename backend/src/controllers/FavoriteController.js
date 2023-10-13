const knex = require("../database");
const AppError = require("../utils/AppError");

class FavoriteController {
  async updateWordFavorite(request, response) {
    const { word, favorite, user_id } = request.body;

    if (!word) {
      throw new AppError("The word field is required.", 400);
    }

    if (!favorite || (favorite !== "Y" && favorite !== "N")) {
      throw new AppError(
        "The favorite field is required and must be 'Y' or 'N'.",
        400
      );
    }

    try {
      await knex.transaction(async (trx) => {
        await trx("favorite")
          .insert({
            word,
            favorite,
            user_id,
            updated_at: knex.fn.now(),
          })
          .onConflict(["word", "user_id"])
          .merge({ favorite, updated_at: knex.fn.now() });

        if (favorite === "N") {
          await trx("favorite")
            .where({
              word,
              user_id,
            })
            .andWhere("favorite", "=", "N")
            .delete();
        }
      });

      response
        .status(200)
        .send({ message: "Word successfully updated/inserted!" });
    } catch (error) {
      throw new AppError("Failed to update/insert word.", 500);
    }
  }

  async listFavorites(request, response) {
    try {
      const { user_id } = request.query;

      const selectedWords = await knex("favorite")
        .select("word", "favorite", "updated_at")
        .where("user_id", Number(user_id))
        .andWhere("favorite", "=", "Y")
        .orderBy("updated_at", "desc");

      return response.status(200).json(selectedWords);
    } catch (error) {
      throw new AppError("Failed to fetch favorites.", 500);
    }
  }
}

module.exports = FavoriteController;
