const knex = require("../database");
const AppError = require("../utils/AppError");

class HistoryController {
  async addWordToHistory(request, response) {
    const { word, user_id } = request.body;

    if (!word) {
      throw new AppError("The word field is required.", 400);
    }

    await knex("history_word").insert({
      word,
      user_id,
      created_at: knex.fn.now(),
    });

    response
      .status(200)
      .send({ message: "Word added to history successfully!" });
  }

  async getAllWords(request, response) {
    const user_id = request.query.user_id;

    const words = await knex
      .select("*")
      .from("history_word")
      .where("user_id", "=", user_id)
      .orderBy("created_at", "desc");

    response.status(200).json(words);
  }
}

module.exports = HistoryController;
