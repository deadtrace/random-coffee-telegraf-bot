import { Scenes, Composer, Markup } from "telegraf";
import SCENES from "./scenesList.js";
import showMainButtons from "../helpers/showMainButtons.js";

const feedback = new Composer();
feedback.on("text", async (ctx) => {
  const formattedText = `Отзыв о работе бота от @${ctx.chat.username}:\n${ctx.message.text}`;
  const { FEEDBACK_CHANNEL_ID } = process.env;
  await ctx.telegram.sendMessage(FEEDBACK_CHANNEL_ID, formattedText);
  await ctx.telegram.editMessageReplyMarkup(
    ctx.chat.id,
    ctx.session.lastBotMessage,
    "",
    {}
  );
  await ctx.reply("Спасибо за обратную связь!");
  await showMainButtons(ctx);
  return ctx.scene.leave();
});
feedback.action("back", async (ctx) => {
  await ctx.deleteMessage();
  await showMainButtons(ctx);
  return ctx.scene.leave();
});

const giveBotFeedbackScene = new Scenes.WizardScene(
  SCENES.GIVE_BOT_FEEDBACK,
  async (ctx) => {
    const { message_id } = await ctx.reply(
      "Пожалуйста, поделитесь своими впечатлениями о работе нашего бота и проблемами, с которыми Вы столкнулись.",
      Markup.inlineKeyboard([Markup.button.callback("Назад", "back")])
    );
    ctx.session.lastBotMessage = message_id;
    return ctx.wizard.next();
  },
  feedback
);

export default giveBotFeedbackScene;
