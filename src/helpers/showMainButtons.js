import { Markup } from "telegraf";
import ACTIONS from "../actions/actionsList.js";

const showMainButtons = async (ctx) => {
  const registered = Boolean(ctx.session.registered);

  const text = registered
    ? "Ты зарегистрирован на встречу. Ожидай приглашения."
    : "Сейчас ты не активен. Для поиска коллеги нажми «Зарегистрироваться на встречу».";

  ctx.reply(text, {
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
};

export default showMainButtons;
