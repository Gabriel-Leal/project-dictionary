const knex = require("../database");
const AppError = require("../utils/AppError");
class WordsController {
  async index(request, response) {
    try {
      const user_id = Number(request.query.user_id);

      const words = await knex("words as w")
        .leftJoin("favorite as f", function () {
          this.on("w.word", "=", "f.word").andOn("f.user_id", "=", user_id);
        })
        .select("w.word", knex.raw("COALESCE(f.favorite, 'N') as favorite"))
        .orderBy("w.word");

      return response.json(words);
    } catch (error) {
      throw new AppError("Failed to fetch favorites.", 500);
    }
  }
}

module.exports = WordsController;
