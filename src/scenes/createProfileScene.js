import { Scenes, Composer, Markup } from "telegraf";
import SCENES from "./scenesList.js";
import showProfileInfo from "../helpers/showProfileInfo.js";
import showMainButtons from "../helpers/showMainButtons.js";
import User from "../models/User.js";
import startCommand from "../commands/start.js";
import logError from "../helpers/logError.js";

const name = new Composer();
name.on("text", async (ctx) => {
  ctx.wizard.state.data = {};
  ctx.wizard.state.data.name = ctx.message.text;
  await ctx.reply("Расскажите о Вашей команде, роли и задачах:");
  return ctx.wizard.next();
});

const workspace = new Composer();
workspace.on("text", async (ctx) => {
  ctx.wizard.state.data.workspace = ctx.message.text;
  const { message_id } = await ctx.reply(
    "Укажите Ваши хобби и увлечения (по желанию):",
    Markup.inlineKeyboard([Markup.button.callback("Пропустить", "next")])
  );
  ctx.session.lastBotMessage = message_id;
  return ctx.wizard.next();
});

const hobbies = new Composer();
const hobbiesStageHandler = async (ctx) => {
  const { message_id } = await ctx.reply(
    "Прикрепите Вашу фотографию (по желанию)",
    Markup.inlineKeyboard([Markup.button.callback("Пропустить", "next")])
  );
  ctx.session.lastBotMessage = message_id;
  return ctx.wizard.next();
};
hobbies.on("text", async (ctx) => {
  ctx.wizard.state.data.hobbies = ctx.message.text;
  ctx.telegram.editMessageReplyMarkup(
    ctx.chat.id,
    ctx.session.lastBotMessage,
    "",
    {}
  );
  await hobbiesStageHandler(ctx);
});
hobbies.action("next", async (ctx) => {
  await ctx.deleteMessage();
  await hobbiesStageHandler(ctx);
});

const photo = new Composer();
const photoStageHandler = async (ctx) => {
  try {
    const userObject = {
      ...ctx.wizard.state.data,
      tid: ctx.chat.id,
      registered: false,
    };
    if (ctx.chat.username) userObject.username = ctx.chat.username;
    await User.findOneAndReplace({ tid: ctx.chat.id }, userObject, {
      upsert: true,
    });

    await ctx.reply("Данные успешно сохранены!");
    await showProfileInfo(ctx);
    await showMainButtons(ctx);
  } catch (error) {
    await ctx.reply("К сожалению, сохранение данных прошло неуспешно.");
    await startCommand(ctx);
    logError(error);
  }
  return ctx.scene.leave();
};
photo.on("photo", async (ctx) => {
  ctx.wizard.state.data.photo_id = ctx.message.photo[0].file_id;
  await photoStageHandler(ctx);
});
photo.action("next", async (ctx) => {
  await ctx.deleteMessage();
  await photoStageHandler(ctx);
});

const createProfileScene = new Scenes.WizardScene(
  SCENES.CREATE_PROFILE,
  async (ctx) => {
    await ctx.reply("Напишите Ваши имя и фамилию");
    return ctx.wizard.next();
  },
  name,
  workspace,
  hobbies,
  photo
);

export default createProfileScene;
