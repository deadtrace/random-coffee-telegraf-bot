import ACTIONS from "../actions/actionsList.js";
import { TEXTS } from "../texts.js";
import { Markup } from "telegraf";

const startCommand = async (ctx) =>
  ctx.reply(TEXTS.START, {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(TEXTS.FILL_PROFILE, ACTIONS.CREATE_PROFILE)],
        [
          Markup.button.url(
            TEXTS.LIFEHACKS_TO_FILL_PROFILE,
            process.env.LINK_TO_ADVICES
          ),
        ],
      ],
    },
  });

export default startCommand;
