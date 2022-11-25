import { Scenes, Composer, Markup } from "telegraf";
import SCENES from "./scenesList.js";
import showMainButtons from "../helpers/showMainButtons.js";
import Feedback from "../models/Feedback.js";

const feedback = new Composer();
feedback.on("text", async (ctx) => {
  const { lastBotMessage } = ctx.session;
  if (lastBotMessage) {
    try {
      await ctx.telegram.editMessageReplyMarkup(
        ctx.chat.id,
        lastBotMessage,
        "",
        {}
      );
    } catch (error) {
      console.error(error);
    }
  }

  const { text } = ctx.message;
  const { username, id } = ctx.chat;
  const formattedText = `Отзыв о работе бота от ${
    username ? `@${username}` : ""
  }(${id}):\n${text}`;
  const { FEEDBACK_CHANNEL_ID } = process.env;
  try {
    await ctx.telegram.sendMessage(FEEDBACK_CHANNEL_ID, formattedText);
    await Feedback.create({
      tid: id,
      username: String(username),
      type: "bot",
      text,
    });
    await ctx.reply("Спасибо за обратную связь!");
  } catch (error) {
    await ctx.reply(
      "Произошла ошибка при отправке обратной связи. Попробуй ещё раз позднее."
    );
  }

  await showMainButtons(ctx);
  return ctx.scene.leave();
});
feedback.action("back", async (ctx) => {
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await showMainButtons(ctx);
  return ctx.scene.leave();
});

const giveBotFeedbackScene = new Scenes.WizardScene(
  SCENES.GIVE_BOT_FEEDBACK,
  async (ctx) => {
    const { message_id } = await ctx.reply(
      "Пожалуйста, поделись своими впечатлениями о работе нашего бота и проблемами, с которыми ты столкнулся.",
      Markup.inlineKeyboard([Markup.button.callback("Назад", "back")])
    );
    ctx.session.lastBotMessage = message_id;
    return ctx.wizard.next();
  },
  feedback
);

export default giveBotFeedbackScene;
