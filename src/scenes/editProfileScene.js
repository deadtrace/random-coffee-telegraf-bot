import { Scenes, Composer, Markup } from "telegraf";
import SCENES from "./scenesList.js";
import showMainButtons from "../helpers/showMainButtons.js";

const handleEdit = new Composer();
handleEdit.action("back", async (ctx) => {
  await ctx.deleteMessage();
  await showMainButtons(ctx);
  return ctx.scene.leave();
});

const editProfileScene = new Scenes.WizardScene(
  SCENES.EDIT_PROFILE,
  async (ctx) => {
    const { message_id } = await ctx.reply(
      "Что-то можно редактировать",
      Markup.inlineKeyboard([Markup.button.callback("Назад", "back")])
    );
    ctx.session.lastBotMessage = message_id;
    return ctx.wizard.next();
  },
  handleEdit
);

export default editProfileScene;
