import { Scenes, Composer, Markup } from "telegraf";
import SCENES from "./scenesList.js";
import showMainButtons from "../helpers/showMainButtons.js";

const handleEdit = new Composer();
handleEdit.action("edit-name", async (ctx) => {
  await ctx.answerCbQuery();
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await ctx.scene.leave();
  return ctx.scene.enter(SCENES.EDIT_PROFILE_NAME);
});
handleEdit.action("edit-workspace", async (ctx) => {
  await ctx.answerCbQuery();
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await ctx.scene.leave();
  return ctx.scene.enter(SCENES.EDIT_PROFILE_WORKSPACE);
});
handleEdit.action("edit-hobbies", async (ctx) => {
  await ctx.answerCbQuery();
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await ctx.scene.leave();
  return ctx.scene.enter(SCENES.EDIT_PROFILE_HOBBIES);
});
handleEdit.action("edit-photo", async (ctx) => {
  await ctx.answerCbQuery();
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await ctx.scene.leave();
  return ctx.scene.enter(SCENES.EDIT_PROFILE_PHOTO);
});
handleEdit.action("back", async (ctx) => {
  await ctx.answerCbQuery();
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  await ctx.scene.leave();
  return ctx.scene.enter(SCENES.VIEW_PROFILE);
});

const editProfileScene = new Scenes.WizardScene(
  SCENES.EDIT_PROFILE,
  async (ctx) => {
    const { message_id } = await ctx.reply("Выбери опцию:", {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback("Изменить имя 📝", "edit-name")],
          [
            Markup.button.callback(
              "Изменить команду, роль, задачи 💼",
              "edit-workspace"
            ),
          ],
          [
            Markup.button.callback(
              "Изменить хобби и увлечения 🏂🏻",
              "edit-hobbies"
            ),
          ],
          [Markup.button.callback("Изменить фотографию 📸", "edit-photo")],
          [Markup.button.callback("Назад 🔙", "back")],
        ],
      },
    });
    ctx.session.lastBotMessage = message_id;
    return ctx.wizard.next();
  },
  handleEdit
);

export default editProfileScene;
