import SCENES from "../scenes/scenesList.js";
import { Markup } from "telegraf";
import { TEXTS } from "../texts.js";

const createProfileAction = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup({
      inline_keyboard: [
        [
          Markup.button.url(
            TEXTS.LIFEHACKS_TO_FILL_PROFILE,
            process.env.LINK_TO_ADVICES
          ),
        ],
      ],
    });
  } catch (error) {
    console.error(error);
  }
  ctx.scene.enter(SCENES.CREATE_PROFILE);
};

export default createProfileAction;
