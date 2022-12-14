import { Scenes, Composer, Markup } from "telegraf";
import SCENES from "./scenesList.js";
import showMainButtons from "../helpers/showMainButtons.js";
import showProfileInfo from "../helpers/showProfileInfo.js";

const profileActions = new Composer();
profileActions.action("back", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await showMainButtons(ctx);
  return ctx.scene.leave();
});
profileActions.action("watch", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await showProfileInfo(ctx);
  await showMainButtons(ctx);
  return ctx.scene.leave();
});
profileActions.action("edit", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await ctx.scene.leave();
  ctx.scene.enter(SCENES.EDIT_PROFILE);
});

const viewProfileScene = new Scenes.WizardScene(
  SCENES.VIEW_PROFILE,
  async (ctx) => {
    const { message_id } = await ctx.reply("Выбери опцию:", {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback("Посмотреть профиль 👤", "watch")],
          [Markup.button.callback("Редактировать профиль ✏️", "edit")],
          [Markup.button.callback("Назад 🔙", "back")],
        ],
      },
    });
    ctx.session.lastBotMessage = message_id;
    return ctx.wizard.next();
  },
  profileActions
);

export default viewProfileScene;
