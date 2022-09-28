import { Scenes, Composer, Markup } from "telegraf";
import SCENES from "./scenesList.js";
import User from "../models/User.js";
import logError from "../helpers/logError.js";

const handleEdit = new Composer();
handleEdit.on("photo", async (ctx) => {
  try {
    await User.updateOne(
      { tid: ctx.chat.id },
      {
        photo_id: ctx.message.photo[0].file_id,
        username: ctx.chat.username ?? null,
      }
    );
    await ctx.telegram.editMessageReplyMarkup(
      ctx.chat.id,
      ctx.session.lastBotMessage,
      "",
      {}
    );
    await ctx.reply("Данные изменены!");
  } catch (error) {
    logError(error);
    await ctx.reply("Произошла ошибка при обновлении данных.");
  }
  await ctx.scene.leave();
  return ctx.scene.enter(SCENES.EDIT_PROFILE);
});
handleEdit.action("back", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  await ctx.scene.leave();
  return ctx.scene.enter(SCENES.EDIT_PROFILE);
});

const editProfilePhotoScene = new Scenes.WizardScene(
  SCENES.EDIT_PROFILE_PHOTO,
  async (ctx) => {
    const { message_id } = await ctx.reply(
      "Прикрепите новую фотографию",
      Markup.inlineKeyboard([Markup.button.callback("Назад 🔙", "back")])
    );
    ctx.session.lastBotMessage = message_id;
    return ctx.wizard.next();
  },
  handleEdit
);

export default editProfilePhotoScene;
