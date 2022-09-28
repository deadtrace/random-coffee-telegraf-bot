import { Markup } from "telegraf";
import ACTIONS from "../actions/actionsList.js";
import User from "../models/User.js";
import logError from "./logError.js";

const showMainButtons = async (ctx, mainText) => {
  try {
    const { registered } = await User.findOne(
      { tid: ctx.chat.id },
      "registered"
    ).exec();

    const text = registered
      ? "Ты зарегистрирован на встречу. Ожидай приглашения."
      : "Сейчас ты не активен. Для поиска коллеги нажми «Зарегистрироваться на встречу».";

    ctx.reply(mainText || text, {
      reply_markup: {
        inline_keyboard: [
          registered
            ? [
                Markup.button.callback(
                  "Отменить регистрацию на встречу ❌",
                  ACTIONS.UNREGISTER_FROM_RANDOM_COFFEE
                ),
              ]
            : [
                Markup.button.callback(
                  "Зарегистрироваться на встречу 🤝🏻",
                  ACTIONS.REGISTER_FOR_RANDOM_COFFEE
                ),
              ],
          [Markup.button.callback("Профиль 👤", ACTIONS.VIEW_PROFILE)],
          [
            Markup.button.callback(
              "Дать фидбек по работе бота 🎤",
              ACTIONS.GIVE_FEEDBACK
            ),
          ],
        ],
      },
    });
  } catch (error) {
    await ctx.reply(
      "Произошла ошибка при загрузке пользовательских данных. Попробуйте ещё раз открыть меню с помощью /menu"
    );
    logError(error, ctx);
  }
};

export default showMainButtons;
