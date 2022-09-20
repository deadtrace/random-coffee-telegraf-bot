import { Markup } from "telegraf";
import ACTIONS from "../actions/actionsList.js";

const showMainButtons = async (ctx) => {
  ctx.reply("Упс. Пока Вы не зарегистрировались на встречу.", {
    reply_markup: {
      inline_keyboard: [
        [
          Markup.button.callback(
            "Зарегистрироваться на встречу 🤝🏻",
            "register-for-meetup"
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
};

export default showMainButtons;
