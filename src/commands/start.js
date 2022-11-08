import ACTIONS from "../actions/actionsList.js";
import { TEXTS } from "../texts.js";
import { Markup } from "telegraf";

const startCommand = async (ctx) =>
  ctx.reply(TEXTS.START, {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(TEXTS.FILL_PROFILE, ACTIONS.CREATE_PROFILE)],
      ],
    },
  });

export default startCommand;
